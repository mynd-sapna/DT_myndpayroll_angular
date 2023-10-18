import { FileSaverService } from './../../Services/file-saver.service';
import { ApiServiceService } from './../../Services/api-service.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ExtractionStoreService } from './../../Services/extraction-store.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IGeneralData, values, Company, IAllocateResponse, IFilteredDataResponse, IAgentSummary, Idownload, IUserFormValues } from './../../Models/generaldata';
import { IAgentQueueResponse, IFilterRequest, } from 'src/app/Models/generaldata';
import { __values } from 'tslib';
import { saveAs } from 'file-saver';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription, catchError, throwError } from 'rxjs';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-payroll-output',
  templateUrl: './payroll-output.component.html',
  styleUrls: ['./payroll-output.component.css'],
})
export class PayrollOutputComponent implements OnInit {
  companylst: any;
  isAdmin: boolean = false;
  loaderHidden = true;
  loading: boolean | any;
  outputForm: any;
  companyoutput: any;
  selectedCompany: any;
  selectedType: null | any;
  rUser: string | any;
  values: any;
  submitted: any;
  data: string[] = [];
  dropdownSettings: IDropdownSettings | any;
  downloadForm: FormGroup | any;
  user: IUserFormValues | any;
  is_admin: boolean | any;
  queryParamId: any = JSON.parse(localStorage.getItem('user') || '{}');
  isLoggedIn: boolean | any;
  localStorageId: any = JSON.parse(localStorage.getItem('user') || '{}');

  Router: any;
  constructor(
    private apiservice: ApiServiceService, private authService: AuthServiceService,
    private filesever: FileSaverService,
    private formBuilder: FormBuilder, private toast: ToastrService,
    private http: HttpClient, private router: Router, private route: ActivatedRoute,
  ) {
    this.downloadForm = this.formBuilder.group({
      company: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  generaldata() {
    this.apiservice.getGeneralData().subscribe((res: any) => {
      this.companylst = res;
    }
    );
  }

  ngOnInit(): void {
    this.localStorageId = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('user',this.localStorageId);
    this.generaldata();
    this.dropdownSettings = {
      singleSelection: true,
      idField: "item_id",
      textField: "name",
      allowSearchFilter: true,
    }
    // this.route.queryParams.subscribe((params) => {
    //   this.queryParamId = params['id'];
    //   const locals = params['fileId'];
    //   console.log('queryParamId:', this.queryParamId);
    //   console.log('fileId:', locals);
    // });

  }

  submitData() {
    const selectedCompany = this.downloadForm.get('company')?.value;
    const companyValue = selectedCompany[0].name;
    const filetypeValue = this.downloadForm.get('type').value;
    const formData = new FormData();
    formData.append('company', companyValue);
    formData.append('type', filetypeValue);
    this.toggleLoader('block');
    this.apiservice.download(formData).subscribe({
      next: (response: any) => {
        if (response.size > 0) {
          setTimeout(() => {
            this.downloadFile(new Blob([response], { type: response.type }), filetypeValue + '-output.xlsx');
          }, 1000);
        } else {
          this.toggleLoader();
          alert('File not found');
        }
      },
      error: (error: any) => {
        this.toggleLoader();
        console.error('Error downloading file:', error);
      },
    });
  }


  downloadFile(response: Blob, fileName: string) {
    const blobUrl = URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  toggleLoader(display: string = 'none') {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = display;
    }
  }

  download(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  downloadPending(btnName: string) {
    this.loaderHidden = false;
    const fd = new FormData();
    let url: string;
    let outputFilename: string;
    if (btnName.includes('Pending')) {
      url = 'https://idppayroll.myndsolution.com/api/download_agent_pending/';
      outputFilename = 'Pending_Cases.xlsx';
    } else {
      url = 'https://idppayroll.myndsolution.com/api/download_agent_processed/';
      outputFilename = 'Processed_Cases.xlsx';
    }

    fd.append('agent', ' admin');
    this.http.post(url, fd, { responseType: 'blob' })
      .subscribe(
        response => {
          this.loaderHidden = true;
          if (response instanceof Blob) {

          } else {
            alert('File not found');
          }
        },
        error => {
          this.loaderHidden = true;
          console.log('ERROR:', error);
          alert('Some error occurred. ');
        }
      );
  }

  downloadRedGreen() {
    this.toggleLoader('block');
    let new_url = 'https://idppayroll.myndsolution.com/api/red_green_file/';
    fetch(new_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/octet-stream',
      },
    })
      .then(response => {
        if (response.status === 200) {
          console.log("Response received");
          return response.blob();
        } else {
          return null;
        }
      })
      .then(response => {
        this.toggleLoader();
      })
      .catch(err => {
        this.toggleLoader();
        alert("Some error occurred. Contact Move78!");
        console.log('Error:', err.message);
      });
  }

  downloadMissingFile(): void {
    const newUrl = 'https://idppayroll.myndsolution.com/api/missing_file/';
    fetch(newUrl, {
      method: 'POST'
    })
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        this.filesever.downloadBinary(url, 'Missing_file.xlsx');
      })
      .catch(err => {
        alert('Some error occurred. Contact development Team');
        console.log('Error:', err.message);
      });
  }

  downloadMissingObject(): void {
    const newUrl = 'https://idppayroll.myndsolution.com/api/missing_object/';
    fetch(newUrl, {
      method: 'POST'
    })
      .then(response => {
        if (response.status === 200) {
          return response.text();
        } else {
          return null;
        }
      })
      .then(text => {
        if (text) {
          const blob = this.filesever.dataURItoBlob(text);
          const url = URL.createObjectURL(blob);
          this.filesever.downloadBinary(url, 'Missing_object.xlsx');
        }
      })
      .catch(err => {
        alert('Some error occurred. Contact Move78!!!');
        console.log('Error:', err.message);
      });
  }
}
function toggle_loader() {
  throw new Error('Function not implemented.');
}


import { CreateCompanyComponent } from './../../Dialog Ref/create-company/create-company.component';
import { ApiServiceService } from './../../Services/api-service.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-upload-company',
  templateUrl: './upload-company.component.html',
  styleUrls: ['./upload-company.component.css']
})
export class UploadCompanyComponent {


  filetypes = [
    { id: 1, text: "Master" }, { id: 2, text: "House " }, { id: 3, text: " Rent" },
    { id: 4, text: "Chapter" }
  ]

  apiCallSuccessful: boolean = false; dataRows: any[] = [
  ];
  fileName = '';
  data: any;
  loading: boolean = false;
  loadingr: boolean = false;
  loadingc: boolean = false;
  loadingh: boolean = false;
  loadingi:boolean = false;
  createcompForm: FormGroup | any;
  dropdownSettings: IDropdownSettings | any;
  dropdownSettingsb: IDropdownSettings | any;
  selectedFile: File | any; values: any;
  progress: number = 0;
  selectedCompany: any;
  selectedFileColor: string = 'green';
  uploadItems: { isUploading: boolean }[] = [
    { isUploading: false },
    { isUploading: false },
    { isUploading: false }
    // Add more items as needed
  ];
  isLoading: boolean;

  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: Router,
    private apiService: ApiServiceService,
    private toast: ToastrService) {
    this.createcompForm = this.formBuilder.group({
      company: ['', Validators.required],
      fileType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getgeneraldata();
    this.dropdownSettings = {
      singleSelection: true,
      textField: "name",
      allowSearchFilter: true,

    };
    this.dropdownSettingsb = {
      singleSelection: true,
      textField: "text",
      allowSearchFilter: true,
    };
  }

  getgeneraldata() {
    this.apiService.getGeneralData().subscribe((companies: any) => {
      this.data = companies;
    });
  }

  createCompany() {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      data: {},
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileColor = 'green';
  }

  masterfileUpload() {
    this.loading = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Master file before uploading.');
      return;
    }
    const selectedCompany = this.createcompForm.get('company').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    companyData.append('company_name', selectedCompany[0].name);
    companyData.append('file', this.selectedFile);
    this.apiService.masterfile(companyData).subscribe(
      (response: any) => {
        if (response != null) {
          this.toast.success('File uploaded successfully', 'Success');
        } else {
        }
      },
      (error: any) => {
        if (error && error.error && error.error.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error('Invalid column names. Expected columns: "EMP_CODE", "EMP_NAME".');
        }
        console.error(error);
      }
    ).add(() => {
      this.loading = false;
    });

  }
  process_file(): void {
    const selectedCompany = this.createcompForm.get('company')?.value[0].name;
    console.warn("companyname", selectedCompany)
    if (selectedCompany.length > 0) {
      const form = new FormData;
      form.append('company_name', selectedCompany);
      var request = { company_name: selectedCompany }

      this.apiService.ocrfiles1(form)
        .pipe(
          tap((response) => {
            console.warn("ocr done", response)
            // this.toast.success('OCR done successfully', 'Success', { timeOut: 1000 });
          }),
          catchError((error) => {
            this.isLoading = false;
            console.log(error);
            return throwError(error);
          })
        )
        .subscribe(
          () => {
            this.apiService.runMeth(form)
              .pipe(
                catchError((error) => {
                  this.isLoading = false;
                  console.log(error);
                  return throwError(error);
                })
              )
              .subscribe((response) => {
                console.warn('meth run', response)
                this.toast.success('Processing completed successfully', 'Success', { timeOut: 5000 });
                this.isLoading = false;
              });
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
          }
        );
    }
  }

  rentfileUpload() {
    this.loadingr = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Rent file before uploading.');
      return;
    }
    const selectedCompany = this.createcompForm.get('company').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    companyData.append('company_name', this.createcompForm.get('company').value[0].name);
    companyData.append('file', this.selectedFile);
    this.apiService.rentfile(companyData).subscribe(
      (response: any) => {
        if (response != null) {
          this.toast.success('File uploaded successfully', 'Success');
        } else {
        }
      },
      (error: any) => {
        if (error && error.error && error.error.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error("Master file has been uploaded multiple times . Please contact with technical team");
        }
        console.error(error);
      }
    ).add(() => {
      this.loadingr = false;
    });
  }

  chapterfileUpload() {
    this.loadingc = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Chapter file before uploading.');
      return;
    }
    const selectedCompany = this.createcompForm.get('company').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    console.log(this.createcompForm.get('company').value);
    companyData.append('company_name', this.createcompForm.get('company').value[0].name);
    companyData.append('file', this.selectedFile);
    this.apiService.chapterfile(companyData).subscribe(
      (response: any) => {
        if (response != null) {
          this.toast.success('File uploaded successfully', 'Success');
        } else {
        }
      },
      (error: any) => {
        if (error && error.error && error.error.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error("Master file has been uploaded multiple times . Please contact with technical team");
        }
        console.error(error);
      }
    ).add(() => {
      this.loadingc = false;
    });
  }

  housefileUpload() {
    this.loadingh = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Chapter file before uploading.');
      return;
    }
    const selectedCompany = this.createcompForm.get('company').value;
    debugger;
    console.log(this.createcompForm.get('company'));
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    companyData.append('company_name', this.createcompForm.get('company').value[0].name);
    companyData.append('file', this.selectedFile);
    this.apiService.housefile(companyData).subscribe(
      (response: any) => {
        if (response != null) {
          this.toast.success('File uploaded successfully', 'Success');
        } else {
        }
      },
      (error: any) => {
        if (error && error.error && error.error.message) {
          this.toast.error(error.error.message);
        } else {
          this.toast.error("Master file has been uploaded multiple times . Please contact with technical team");
        }
        console.error(error);
      }
    ).add(() => {
      this.loadingh = false;
    });
  }

  chapterSamDownoad() {
    this.apiService.getrentSampleFile().subscribe((response) => {
      const contentDispositionHeader = response.headers.get('content-disposition');
      let filename = 'InvestmentProof-ChapterVIA.xlsx';
      if (contentDispositionHeader) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      const blob = new Blob([response.body], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename; // Set the download attribute
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  masterSamDownoad() {
    this.apiService.getMasterSampleFile().subscribe(response => {
      const contentDispositionHeader = response.headers.get('content-disposition');
      let filename = 'InvestmentProofMaster.xlsx';
      if (contentDispositionHeader) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      const blob = new Blob([response.body], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename; // Set the download attribute
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }


  rentSamDownoad() {
    this.apiService.getrentSampleFile().subscribe((response) => {
      const contentDispositionHeader = response.headers.get('content-disposition');
      let filename = 'InvestmentProof-RentDetails.xlsx';
      if (contentDispositionHeader) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      const blob = new Blob([response.body], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename; // Set the download attribute
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  houseSamDownoad() {
    this.apiService.gethouseSampleFile().subscribe((response) => {
      const contentDispositionHeader = response.headers.get('content-disposition');
      let filename = 'InvestmentProof-HousePropertyDetails.xlsx';
      if (contentDispositionHeader) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      const blob = new Blob([response.body], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename; // Set the download attribute
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

}

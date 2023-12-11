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
  tableData: any[] = [
    { selected: false, /* other properties */ },
    { selected: false, /* other properties */ },
    // Other rows
  ];

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
  selectedCompany: string;
  selectedFileColor: string = 'green';
  uploadItems: { isUploading: boolean }[] = [
    { isUploading: false },
    { isUploading: false },
    { isUploading: false }
    // Add more items as needed
  ];
  isLoading: boolean;
  loadingTemplate: any = false;
  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: Router,
    private apiService: ApiServiceService,
    private toast: ToastrService) {
    this.createcompForm = this.formBuilder.group({
      company1: ['', Validators.required],
      company2: ['', Validators.required],
      company3: ['', Validators.required],
      company4: ['', Validators.required],
      fileType: ['', Validators.required]
    });
    this.createcompForm.get('company')?.valueChanges.subscribe((selectedCompany) => {
      if (selectedCompany.length > 0) {
        const companyName = selectedCompany[0].name;
        // Set the selected company for all sections
        this.createcompForm.get('company1')?.setValue([{ name: companyName }], { emitEvent: false });
        this.createcompForm.get('company2')?.setValue([{ name: companyName }], { emitEvent: false });
        this.createcompForm.get('company3')?.setValue([{ name: companyName }], { emitEvent: false });
        this.createcompForm.get('company4')?.setValue([{ name: companyName }], { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.getgeneraldata();
    this.dropdownSettings = {
      singleSelection: true,
      textField: "name",
      allowSearchFilter: true,
      closeDropDownOnSelection:true,

    };
    this.dropdownSettingsb = {
      singleSelection: true,
      textField: "text",
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
    };
  }

  getgeneraldata() {
    this.apiService.getGeneralData().subscribe((companies: any) => {
      this.data = companies;
    });
  }

  // createCompany() {
  //   const dialogRef = this.dialog.open(CreateCompanyComponent, {
  //     data: {},
  //   });
  // }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileColor = 'green';
  }


  masterfileUpload() {
    if (!this.selectedFile) {
      this.toast.warning('Please select a Master file before uploading.');
      return;
    }
    const selectedCompany = this.createcompForm.get('company1').value;
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

  rentfileUpload() {
    this.loadingr = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Rent file before uploading.');
      return;
    }
    const selectedCompany = this.createcompForm.get('company1').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    companyData.append('company_name', selectedCompany[0].name);
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
    const selectedCompany = this.createcompForm.get('company1').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    companyData.append('company_name', selectedCompany[0].name);
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
    const selectedCompany = this.createcompForm.get('company1').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return;
    }
    const companyData = new FormData();
    companyData.append('company_name', selectedCompany[0].name);
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

  selectAllRows(event: any) {
    const isChecked = event.target.checked;
    // Set the selected state for all rows
    this.tableData.forEach((row) => {
      row.selected = isChecked;
    });
  }

onItemSelect(company: any): void {
    if (company && company.length > 0) {
      this.selectedCompany = company[0].name;
    }
  }
}

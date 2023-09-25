
import { CreateCompanyComponent } from './../../Dialog Ref/create-company/create-company.component';
import { ApiServiceService } from './../../Services/api-service.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

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
  loadingr:boolean = false;
  loadingc:boolean=false;
  loadingh:boolean= false;
  createcompForm: FormGroup | any;
  dropdownSettings: IDropdownSettings | any;
  dropdownSettingsb: IDropdownSettings | any;
  selectedFile: File | any; values: any;
  progress: number = 0;
  selectedCompany:any;
  selectedFileColor: string = 'green';
  uploadItems: { isUploading: boolean }[] = [
    { isUploading: false },
    { isUploading: false },
    { isUploading: false }
    // Add more items as needed
  ];

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
          // Handle the case where the response is not as expected
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
      this.loading = false; // Stop the loader after API call is complete
    });

  }

  rentfileUpload() {
    this.loadingr = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Rent file before uploading.');
      return; // Exit the function if file is not selected
    }
    const selectedCompany = this.createcompForm.get('company').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return; // Exit the function if company is not selected
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
    this.loadingr = false; // Stop the loader after API call is complete
  });
  }

  chapterfileUpload() {
    this.loadingc = true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Chapter file before uploading.');
      return; // Exit the function if file is not selected
    }
    const selectedCompany = this.createcompForm.get('company').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return; // Exit the function if company is not selected
    }
    const companyData = new FormData();
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
      this.loadingc = false; // Stop the loader after API call is complete
    });
    }

  housefileUpload() {
    this.loadingh =true;
    if (!this.selectedFile) {
      this.toast.warning('Please select a Chapter file before uploading.');
      return; // Exit the function if file is not selected
    }
    const selectedCompany = this.createcompForm.get('company').value;
    if (!selectedCompany) {
      this.toast.warning('Please select a company before uploading file.');
      return; // Exit the function if company is not selected
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

    process_file() {
      const selectedCompany = this.createcompForm.get('company').value;
      const companyData = new FormData();
      if (selectedCompany && selectedCompany.length > 0) {
        companyData.append('company_name', selectedCompany[0].name);
      }
      this.apiService.ocrfiles(companyData).subscribe(
        (response: any) => {
          if (response != null) {
            this.toast.success('File uploaded successfully', 'Success');
          } else {
          }
        },
        (error: any) => {

        }
      );
    }

}

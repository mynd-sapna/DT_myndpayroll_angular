
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

  data: any;
  loading: boolean = false;
  createcompForm: FormGroup | any;
  dropdownSettings: IDropdownSettings | any;
  dropdownSettingsb: IDropdownSettings | any;
  selectedFile: File | any; values: any;
  progress: number = 0;
  selectedCompany:any;
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
  }

  masterfileUpload() {
    const formData = new FormData();
    formData.append('company_name', this.createcompForm.get('company')?.value[0]?.name || '');
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
    this.apiService.masterfile(formData).subscribe(
      (event: any) => {
        if (typeof event === 'object') {
          this.loading = false;
          this.toast.success('File uploaded successfully', 'Success');
        }
      },
      (error: any) => {
        this.loading = false;
        this.toast.error('An error occurred. Please try again later.', 'Error');
      }
    );
  }

  rentfileUpload() {
    console.log(this.selectedFile);
    console.log('company:', this.createcompForm.get('company').value);
    console.log('selectedFile:', this.selectedFile);
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
      this.toast.error('An error occurred. Please try again later.', 'Error');
      console.error(error);
    }
  );
  }

  chapterfileUpload() {
    console.log(this.selectedFile);
    console.log('company:', this.createcompForm.get('company').value);
    console.log('selectedFile:', this.selectedFile);
    const companyData = new FormData();
    companyData.append('file', this.selectedFile),
    companyData.append('company_name', this.createcompForm.get('company').value[0].name);
    this.apiService.chapterfile(companyData).subscribe(
      (response: any) => {
        
        if (response != null) {
          this.toast.success('File uploaded successfully', 'Success');
        } else {
        }
      },
      (error: any) => {
        this.toast.error('An error occurred. Please try again later.', 'Error');
        console.error(error);
      }
    );
    }

  housefileUpload() {
    const companyData = new FormData();
    companyData.append('file', this.selectedFile),
    companyData.append('company_name', this.createcompForm.get('company').value[0].name);
    this.apiService.housefile(companyData).subscribe(
       (response: any) => {
      if (response != null) {
        this.toast.success('File uploaded successfully', 'Success');
      } else {
      }
    },
    (error: any) => {
      this.toast.error('An error occurred. Please try again later.', 'Error');
      console.error(error);
    }
  );
  }
}


import { CreateCompanyComponent } from './../../Dialog Ref/create-company/create-company.component';
import { ApiServiceService } from './../../Services/api-service.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
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
  selectedFile: File | any;values:any;
  progress: number = 0;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private route: Router, private apiService: ApiServiceService, private toast: ToastrService) {
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

  masterfileUpload(values:any) {
    this.loading = !this.loading;
    console.log(this.selectedFile);
    const companyData = {
      company: this.createcompForm.get('company').value,
      fileType: this.createcompForm.get('fileType').value,
      file: this.selectedFile
    }
    this.apiService.masterfile(companyData).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.loading = false; // Flag variable
        }
      }
    );
  }

  rentfileUpload(rowData: any) {
    const formData = new FormData();
    formData.append('company', this.data.company);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    this.apiService.rentfile(formData).subscribe(
      (response: any) => {
        // Handle API response here if needed
        console.log('API Response:', response);
      },
      (error: any) => {
        // Handle API error here if needed
        console.error('API Error:', error);
      }
    );
  }

  chapterfileUpload(rowData: any) {
    const formData = new FormData();
    formData.append('company', this.data.company);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    this.apiService.chapterfile(formData).subscribe(
      (response: any) => {
        // Handle API response here if needed
        console.log('API Response:', response);
      },
      (error: any) => {
        // Handle API error here if needed
        console.error('API Error:', error);
      }
    );
  }

  housefileUpload(rowData: any) {
    const formData = new FormData();
    formData.append('company', this.data.company);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    this.apiService.housefile(formData).subscribe(
      (response: any) => {
        // Handle API response here if needed
        console.log('API Response:', response);
      },
      (error: any) => {
        // Handle API error here if needed
        console.error('API Error:', error);
      }
    );
  }
}

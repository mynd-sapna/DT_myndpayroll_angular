import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiServiceService } from '../../Services/api-service.service';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, tap, throwError } from "rxjs";
@Component({
  selector: 'app-import-company',
  templateUrl: './import-company.component.html',
  styleUrls: ['./import-company.component.css']
})
export class ImportCompanyComponent implements OnInit {
  @ViewChild('downloadLink') downloadLink!: ElementRef;
  uploadForm: any;
  data: any;
  fileInputInvalid = false;
  fileInputTouched = false;
  dropdownSettings: IDropdownSettings | any;
  dropdownSettingsb: IDropdownSettings | any;
  selectedFile: File | null = null;

  filetypes = [
    { id: 1, text: "chapter (6A)" }, { id: 2, text: "House Property" }, { id: 3, text: "House Rent" },
    { id: 4, text: "Employee Master" }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
  ) {
    this.uploadForm = this.formBuilder.group({
      company: ['', Validators.required],
      filetype: ['', Validators.required],
    });
    this.watchFormChanges();
  }

  getgeneraldata() {
    this.apiService.getGeneralData().subscribe((companies: any) => {
      this.data = companies;
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileInputTouched = true;
    this.fileInputInvalid = false;
  }

  private watchFormChanges() {
    this.uploadForm.valueChanges.subscribe((formValues:any) => {
      if (this.uploadForm.valid) {
        const company = formValues.company;
        const filetype = formValues.filetype;
        // this.callYourAPI(company, filetype);
      }
    });
  }

  public callYourAPI(company: string, filetype: string) {
    // this.apiService.getSampleFile().subscribe(
    //   (responseBlob: Blob) => {
    //     this.createDownloadLink(responseBlob, `${company}_${filetype}.pdf`);
    //   },
    //   (error) => {
    //     console.error('API call error:', error);
    //   }
    // );
    // console.log('API called with company:', company, 'and filetype:', filetype);
  }

  private createDownloadLink(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }

  onUpload() {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    // const formData = new FormData();
    // formData.append('file', this.selectedFile);

    // // Adjust the API endpoint and headers based on your API requirements
    // const apiUrl = 'https://example.com/api/upload';
    // this.http.post(apiUrl, formData).subscribe(
    //   (response) => {
    //     console.log('File uploaded successfully:', response);
    //     // Handle the response from the API, if needed
    //   },
    //   (error) => {
    //     console.error('File upload error:', error);
    //     // Handle the error, if needed
    //   }
    // );
  }



  onSubmit() {
    if (this.uploadForm.valid) {
      // Perform your submit logic here, such as sending the form data to the server.
      // For example:
      const formData = this.uploadForm.value;
      console.log(formData); // Replace this with your actual logic to send the data to the server.
    } else {
      // If the form is invalid, you can display an error message or take appropriate action.
    }
  }
}

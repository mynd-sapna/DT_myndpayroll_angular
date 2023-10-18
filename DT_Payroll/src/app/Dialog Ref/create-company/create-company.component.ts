import { ApiServiceService } from './../../Services/api-service.service';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/Models/generaldata';
import { CUser, user } from '../../Models/generaldata';
import { AuthServiceService } from '../../Services/auth-service.service';
import { RootStoreService } from '../../Services/rootstore.service';
import { ExtractionStoreService } from 'src/app/Services/extraction-store.service';
import { Router } from '@angular/router';
import { IUserFormValues, IUser } from '../../Models/generaldata';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent {
  @Output() companyCreated = new EventEmitter<Company>();
  createcompForm: FormGroup | any;
  isLoading: boolean|any;
  submitError: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private toast:ToastrService,      private http: HttpClient,
    private dialogRef: MatDialogRef<CreateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  get companyNameControl() {
    return this.createcompForm.get('companyName');
  }

  ngOnInit(): void {
    this.createcompForm = this.formBuilder.group({
      companyName: ['', Validators.required],
    });
  }

onSave(): void {
  if (this.createcompForm.invalid) {
    this.submitError = 'Please fill in all the required fields.';
    return;
  }

  const companyData = {
    name: this.createcompForm.get('companyName')?.value,
  };

  this.apiService.createCompany(companyData).subscribe(
    (response: any) => {
      this.toast.success(JSON.parse(response).message);

      // Reload the page after a short delay (e.g., 1 second)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    (error: any) => {
      this.toast.error('A company with that name already exists. Please try again later.');
      this.dialogRef.close();
    }
  );
}

}

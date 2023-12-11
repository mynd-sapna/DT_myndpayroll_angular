import { ApiServiceService } from './../../Services/api-service.service';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/Models/generaldata';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent {
  @Output() companyCreated = new EventEmitter<Company>();
  createcompForm: FormGroup | any;
  isLoading: boolean | any;
  submitError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<CreateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  get companyNameControl() {
    return this.createcompForm.get('companyName');
  }

  ngOnInit(): void {
    this.createcompForm = this.formBuilder.group({
      companyName: ['', [Validators.required, this.uppercaseValidator]],
    });
  }

  uppercaseValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value as string;
    // Check if the value is not empty and contains only uppercase letters
    if (value && !/^[A-Z]+$/.test(value)) {
      return { 'uppercaseRequired': true };
    }
    return null;
  }

  onInputChange() {
    const currentValue = this.companyNameControl.value as string;
    // Convert to uppercase and update the form control value
    this.companyNameControl.setValue(currentValue.toUpperCase(), { emitEvent: false });
  }

  onSave(): void {
    if (this.createcompForm.valid) {
      // Convert the companyName to uppercase before submitting
      const companyName = this.companyNameControl.value.toUpperCase();

      const companyData = {
        name: companyName,
      };

      this.apiService.createCompany(companyData).subscribe(
        (response: any) => {
          this.toast.success(JSON.parse(response).message);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
        (error: any) => {
          this.toast.error('A company with that is name already exists. Please try again later.');
          this.dialogRef.close();
        }
      );
    } else {
      this.toast.error('Form is not valid. Please check the fields.');
    }
  }
}

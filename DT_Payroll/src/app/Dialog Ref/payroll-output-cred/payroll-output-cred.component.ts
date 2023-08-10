import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser, IUserFormValues } from 'src/app/Models/generaldata';
import { AuthServiceService } from 'src/app/Services/auth-service.service';

@Component({
  selector: 'app-payroll-output-cred',
  templateUrl: './payroll-output-cred.component.html',
  styleUrls: ['./payroll-output-cred.component.css']
})
export class PayrollOutputCredComponent {
  signInForm: FormGroup;
  submitError: string | any;
  user: IUserFormValues | any;
  isLoggedIn: any;
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authservice: AuthServiceService,
    private toast: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<PayrollOutputCredComponent>,
  ) {
    {
      this.signInForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  }
  ngOnInit(): void {
    this.authservice.isLoggedIn().subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        // User is already logged in
        this.toast.info('You are already authenticated.');
        this.dialogRef.close();
        this.router.navigate(['/download']);
      } else {
        // User is not logged in
        this.user = null;
      }
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const user: IUserFormValues = {
        username: this.signInForm.get('username')?.value,
        password: this.signInForm.get('password')?.value,
      };
      this.dialogRef.close();

      this.router.navigate(['/download']);
    } else {
      this.toast.error('Invalid form data. Please fill all required fields.');
    }
  }
  onCancel() {
    this.signInForm.reset();
    this.dialog.closeAll();
  }
}

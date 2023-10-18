import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
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
  locals :any = JSON.parse(localStorage.getItem('user') || '{}');
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authservice: AuthServiceService,
    private toast: ToastrService, private Router: Router,
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

  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const user: IUserFormValues = {
        username: this.signInForm.get('username')?.value,
        password: this.signInForm.get('password')?.value,
      };
      this.authservice.login(user).subscribe(
        (response: IUser | null) => {
          if (response != null) {
            // API call successful
            localStorage.setItem('user', JSON.stringify(response));
            const token = response.token;
            localStorage.setItem('jwt', response.id.toString());
            if (response.admin) {
              console.log("User is logged in");
              this.Router.navigate(['/downloads']);
            }
            this.dialogRef.close();
          } else {
            this.toast.error('Invalid form data. Please fill all required fields.');
          }
        }
      )
    }
  }

  onCancel() {
    this.signInForm.reset();
    this.dialog.closeAll();
  }

 download(locals: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        locals: this.user
      }
    };
    this.Router.navigate(['/download'], navigationExtras);
    console.warn('navigationExtras', navigationExtras);
  }
}

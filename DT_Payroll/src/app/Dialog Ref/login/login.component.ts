
import { AuthServiceService } from "../../Services/auth-service.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { tap } from "rxjs";
import { NavigationExtras, Router } from "@angular/router";
import { IUser, IUserFormValues } from "src/app/Models/generaldata";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  submitError: string | any;
  onloading = false;
  locals :any = JSON.parse(localStorage.getItem('user') || '{}');
  user: IUser | null = null; auto: any;
  public showPassword: boolean = false;
  isAdmin: any;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;

  }
  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthServiceService,
    private Router: Router,
    public dialog: MatDialog,
    private toast: ToastrService,
    // private dialogRef: MatDialogRef<LoginComponent>,
    private snackBar: MatSnackBar
  ) {

  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
      // username: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{5}$/)]],
      // password: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{8}$/)]]
    });
    this.locals = this.locals.id;
  }
  private getUser(token: string): void {
    this.authservice.getCurrentUser(token).pipe(
      tap((user: IUser | undefined) => {
        if (user) {
        }
      })
    ).subscribe({
      complete: () => this.appLoaded(),
      error: (error: any) => {
        console.log(error);
        this.appLoaded();
      }
    });
  }
  private appLoaded(): void {
    // Update app loaded state
  }
  onSubmit(): void {
    this.submitError = null;
    if (this.loginForm.valid) {
      this.onloading = true; // Show loading spinner
      const user: IUserFormValues = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
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
              this.Router.navigate(['/allocation']);
            } else {
              this.Router.navigate(['/worklist']);
            }
            // Close the dialog after successful login
            // this.dialogRef.close();
          } else {
            // API call successful, but invalid credentials
            this.submitError = 'Forbidden: Invalid username or password!';
          }
          // Turn off loading spinner after API response is received
          this.onloading = false;
        },
        (error: any) => {
          this.onloading = false; // Turn off loading spinner for error cases
          if (error instanceof HttpErrorResponse) {
            if (error.status === 403) {
              // Invalid credentials (username or password)
              this.submitError = 'Forbidden: Invalid username or password!';
            } else if (error.status === 404) {
              // User not found or other 404 error
              this.submitError = 'User not found or other 404 error';
            } else {
              // Other server-side error
              this.toast.error('Network Error - make sure API is running!');
            }
          } else {
            // Non-HTTP error (e.g., network error)
            console.error(error);
            this.submitError = 'Network error occurred';
          }
        }
      );
    }
  }

  isloginValid(): boolean {
    return this.loginForm.valid;
  }


}

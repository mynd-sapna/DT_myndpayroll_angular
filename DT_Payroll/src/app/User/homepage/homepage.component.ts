
import { AuthServiceService } from './../../Services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginComponent } from '../../Dialog Ref/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser, IUserFormValues } from 'src/app/Models/generaldata';
import { BehaviorSubject, Observable, filter, tap } from 'rxjs';
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

  export class HomepageComponent implements OnInit {

  isLoggedIn: boolean = false;
  user: IUserFormValues | any;
  adminName: any;
  role: string | any;
  loggedInUser: any;
  appLoaded$: Observable<boolean> | any;
  loginForm: FormGroup | any;
  submitError: string | any;
  onloading = false;
  public showPassword: boolean = false;
  isAdmin: any;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  routeURL: string | any;
  constructor(private router: Router,  private toast: ToastrService,public dialog: MatDialog, private authservice: AuthServiceService, private formBuilder: FormBuilder,) {
      this.authservice.isLoggedIn().subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
      });

  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
      // username: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{5}$/)]],
      // pass\
    });
    this.authservice.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        const IUserFormValues = localStorage.getItem('user');
        this.user = JSON.parse(IUserFormValues || '{}');
      } else {
        this.user = null;
      }
    });
  }

  navigateToQueue() {
    if (this.user && !this.user.admin) {
      this.router.navigate(['/worklist']);
    } else if (this.user && this.user.admin) {
      this.router.navigate(['/admin/allocate']);
    }
  }
  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: {},
    });
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
              this.router.navigate(['/allocation']);
            } else {
              this.router.navigate(['/worklist']);
            }
            // Close the dialog after successful login
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


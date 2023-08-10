
import { CUser, user } from '../../Models/generaldata';
import { AuthServiceService } from '../../Services/auth-service.service';
import { RootStoreService } from '../../Services/rootstore.service';
import { ExtractionStoreService } from 'src/app/Services/extraction-store.service';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { IUserFormValues, IUser } from '../../Models/generaldata';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';                                                                                          
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css'],
})
export class CreateuserComponent implements OnInit {
  public showPassword: boolean = false;
  onloading: boolean | any;
  toastService: any;
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  createUserForm: FormGroup | any;
  errorMessage: string | any;
  submitError: string | any;
  password: any;
  hide: boolean = false;
  username: any;

  constructor(
    private formBuilder: FormBuilder,
    private Router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private authservice: AuthServiceService,
    private toast:ToastrService
  ) {
  }
  ngOnInit(): void {
    this.createUserForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit(): void {
    if (this.createUserForm.valid) {
      this.onloading = true;
      const user: CUser = {
        username: this.createUserForm.get('username')?.value,
        password: this.createUserForm.get('password')?.value,
      };
      this.authservice.createUser(user).subscribe(
        (response: any) => {
          this.onloading = false;
          if (response != null) {
            this.toast.success('User Created Successfully!'); // Show success toast message
            this.Router.navigate(['/allocation']);
          } else {
            this.submitError = 'Invalid credentials';
          }
        },
        (error: any) => {
          this.onloading = false;
          this.toast.error('A user with that username already exists.Try again later'); // Show error toast message
          console.error(error);
        }
      );
    }
  }
  closeAll() {
    if (this.createUserForm.valid) {
    };
    this.dialog.closeAll();
  }

}

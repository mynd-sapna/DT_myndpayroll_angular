import { RootStoreService } from './../../Services/rootstore.service';
import { AuthServiceService } from './../../Services/auth-service.service';
import { ApiServiceService } from './../../Services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IUser, IUserFormValues, IUserLogoutRequest } from 'src/app/Models/generaldata';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs';
import { TokenType } from '@angular/compiler';
import { CreateuserComponent } from 'src/app/Dialog Ref/createuser/createuser.component';
import { PayrollOutputCredComponent } from 'src/app/Dialog Ref/payroll-output-cred/payroll-output-cred.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: IUserFormValues | any;
  adminName: any;
  role: string | any;
  loggedInUser: any;
  isLoggedIn: boolean | any;
  appLoaded$: Observable<boolean> | any;
 

  constructor(
    public dialog: MatDialog,
    private route: Router,
    private apiservice: ApiServiceService,
    private http: HttpClient,
    private AuthServiceService:AuthServiceService
  ) { }

  ngOnInit(): void {
    this.AuthServiceService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        // User is logged in, update the user property with the logged-in user data
        const IUserFormValues = localStorage.getItem('user');
        this.user = JSON.parse(IUserFormValues || '{}');
      } else {
        // User is logged out, reset the user property
        this.user = null;
      }
    });
  }

 createuser() {
    const dialogRef = this.dialog.open(CreateuserComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
 
  });
 }

 outputCred() {
  const dialogRef = this.dialog.open(PayrollOutputCredComponent, {
    data: {},
  });
  dialogRef.afterClosed().subscribe((result) => {
 

  });
}


  logout() {
    if (!this.isLoggedIn) {
      console.error("No user is logged in");
      return;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    this.route.navigate(['/']);
    const user: IUserLogoutRequest = {
      id: this.user?.id || 0,
    };
    // this.AuthServiceService.logout().subscribe(
    this.AuthServiceService.logout(user).subscribe(
      (response: IUser | null) => {
        console.log(response);
        localStorage.removeItem('admin');
        this.route.navigateByUrl('/');
      },
      (error: any) => {
        console.error(error);
        // Handle the error
      }
    );
  }
}

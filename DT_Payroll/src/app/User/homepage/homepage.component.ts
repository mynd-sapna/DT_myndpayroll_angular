
import { AuthServiceService } from './../../Services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginComponent } from '../../Dialog Ref/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser, IUserFormValues } from 'src/app/Models/generaldata';
import { BehaviorSubject, Observable, filter, tap } from 'rxjs';
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

  routeURL: string | any;
  constructor(private router: Router, public dialog: MatDialog, private authservice: AuthServiceService) {
      this.authservice.isLoggedIn().subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
    // Assuming you have a method to get the logged-in user.
      });

  }
  ngOnInit(): void {
    this.authservice.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        const IUserFormValues = localStorage.getItem('user');
        this.user = JSON.parse(IUserFormValues || '{}');
``
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

}


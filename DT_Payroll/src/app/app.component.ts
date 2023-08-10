import { AuthServiceService } from './Services/auth-service.service';
import { ApiServiceService } from './Services/api-service.service';
import { ExtractionStoreService } from './Services/extraction-store.service';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, finalize, tap, Observable, BehaviorSubject } from 'rxjs';
import { IUser, user } from './Models/generaldata';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-app';
  routeURL: string |any;

  constructor(private router: Router, private AuthServiceService: AuthServiceService, private http: HttpClient, private route: ActivatedRoute, private ApiServiceService: ApiServiceService) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.routeURL = event.url;
      });
  }

  // ngOnInit(): void {
  // const jwtToken = localStorage.getItem('jwt');
  // if (jwtToken) {
  //   // Set the token in AuthServiceService
  //   this.AuthServiceService.setToken("jwt");
  // }
}


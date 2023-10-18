import { AuthServiceService } from './../app/Services/auth-service.service';
import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.dev';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private baseURL = `${environment.baseUrl}/api`;

  constructor(private authService: AuthServiceService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const token = this.authService.getToken();
    const isLoggedIn = !!token;
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    console.log('Is Logged In:', isLoggedIn);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
       
      });
    }

    return next.handle(request);
  }
}


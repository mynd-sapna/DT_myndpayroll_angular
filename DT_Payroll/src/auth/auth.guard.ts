import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/Services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}
  canActivate(): any {
    let isLoggedIn = false;
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      isLoggedIn = loggedIn;
      if (!isLoggedIn) {
        this.router.navigate(['']); // Redirect to login page or any other desired page
      }
    });
    return isLoggedIn;
  }

}

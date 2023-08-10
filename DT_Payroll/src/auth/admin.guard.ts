import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/Services/auth-service.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
    constructor(private authService: AuthServiceService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
        return true;
      } else {
        this.router.navigate(['/worklist']); // Redirect to the user-specific route
        return false;
      }
    }
}


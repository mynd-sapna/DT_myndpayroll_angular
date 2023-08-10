import { ApiServiceService } from './api-service.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IUser, IUserFormValues, IUserLogoutRequest } from '../Models/generaldata';
import { environment } from 'src/environments/environment.dev';
import { Token } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  user: IUser | any;
  emit(arg0: any) {
    throw new Error('Method not implemented.');
  }
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private baseURL = `${environment.baseUrl}/api`;
  constructor(private http: HttpClient, private router: Router, private ApiServiceService: ApiServiceService) {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }
  refreshToken() {
    return this.http.post(this.baseURL + 'refreshtoken', { HttpHeaders });
  }
  getCurrentUser(token: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseURL}/users/?id=${token}`).pipe(
      tap((response: any) => {
        const userToken = response.token;
        localStorage.setItem('jwt', response.id);
      }),
      map((response: any) => response.user as IUser)
    );
  }
  getUser(token: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseURL}/users/?id=${token}`).pipe(
      tap((response: any) => {
        this.user = response.user;
      })
    );
  }
  login(user: IUserFormValues): Observable<IUser | null> {
    const headers = new HttpHeaders();
    console.log('Attempting login with username:', user.username);
    return this.http.post<IUser | null>(`${this.baseURL}/login`, user, { headers }).pipe(
      tap((response: IUser | null) => {

        if (response) {
          this.isLoggedInSubject.next(true);
          const userToken = response.token;
          localStorage.setItem('jwt', response.id.toString());
        }
      })
    );
  }


  logout(user: IUserLogoutRequest): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/logout`, user).pipe(
      tap(() => {
        // If logout is successful, set the isLoggedInSubject to false
        this.isLoggedInSubject.next(false);
      })
    );
  }

  isAuthenticated(){
    const authToken = 'Basic YWRtaW46YWRtaW4=';
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    return this.isLoggedInSubject.asObservable();
  }

  createUser(values: IUserFormValues): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseURL}/create`, values);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isAdmin(): boolean {
    const user = this.user; // Get the user data directly from the property
    return user?.admin === true;
  }

  getUserRole(): boolean {
    const user = this.getUser(this.user); // Assuming you have a method to get the user
  return null;
  }
}


import { HttpClient } from '@angular/common/http';
import { RootStoreService } from './rootstore.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { observable, action, reaction } from 'mobx';

export class CommonStoreService {
//   token: string | null = window.localStorage.getItem('jwt');
// appLoaded = false;

//   constructor() {
//     this.initializeTokenReaction();
//   }
//   setToken(token: string | null): void {
//     this.token = token;
//   }

//   setAppLoaded(): void {
//     this.appLoaded = true;
//   }

//   private initializeTokenReaction(): void {
//     reaction(
//       () => this.token,
//       token => {
//         if (token) {
//           window.localStorage.setItem('jwt', token);
//         } else {
//           window.localStorage.removeItem('jwt');
//         }
//       }
//     );
//   }
}

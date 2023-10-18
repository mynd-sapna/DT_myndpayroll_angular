import { Company } from './../Models/generaldata';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { createBrowserHistory, History } from 'history'
import {
  AgentQueueRequest,
  IAgentQueueResponse,
  IAgentStatus,
  IAgentSummary,
  IAllocateResponse,
  IFilterRequest,
  IFilteredDataResponse,
  IGeneralData,
  IMiddle,
  IUser,
  IUserFormValues,
  IUserLogoutRequest,
  IVerify,
  IVerifyResponse,
  Idownload,
  agent_queue, FileData
} from '../Models/generaldata';

import { Router } from '@angular/router';
import axios from 'axios';
import { IFileDataResponse } from '../Models/filedata';
import { environment } from 'src/environments/environment.dev';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  loadingInitial: boolean | any;
  toastrService: any;
  isLoggedIn$(): any {
    throw new Error('Method not implemented.');
  }

  private baseURL = `${environment.baseUrl}/api`;
  companySummary: IFilteredDataResponse | any;
  agentSummary: IAgentSummary | any;
  company: string = "";

  public IUser: Observable<IUser> | any;
  constructor(private http: HttpClient, private router: Router) { }

  getQueue(agent: number): Observable<IAgentQueueResponse> {
    const data = new AgentQueueRequest(agent);
    return this.http.post<IAgentQueueResponse>(`${this.baseURL}/get_agent_queue`, data);
  }



  getVerificationViewData(id: string): Observable<any> {
    const url = this.getVerificationViewUrl(id);
    return this.http.get(url);
  }

  getVerificationViewUrl(id: string): string {
    return `${this.baseURL}/static`;
  }


  getGeneralData(): Observable<IGeneralData> {
    return this.http.get<IGeneralData>(`${this.baseURL}/get_general_data`);
  }

  getData(id: any): Observable<IFileDataResponse> {
    return this.http.get<any>(`${this.baseURL}/get_file_data/?id=${id}`);
  }

  getSortedData(values: IFilterRequest): Observable<IFilteredDataResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<IFilteredDataResponse>(`${this.baseURL}/get_employees_count`, values, httpOptions);
  }

  getComapnyAgentSummary(company: string): Observable<IAgentSummary> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get<IAgentSummary>(`${this.baseURL}/get_all_agents_data/?company=${company}`, httpOptions);
  }

  Allocate(values: any): Observable<IAllocateResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.baseURL}/set_agent`, values, { headers });
  }
  verify(values: any): Observable<IVerifyResponse> {
    return this.http.post<any>(`${this.baseURL}/set_verification`, values)
  }

  getAgentStatus(id: number): Observable<IAgentStatus> {
    return this.http.get<IAgentStatus>(`${this.baseURL}/get_agent_stats/?agent=${id}`);
  }

  createCompany(values: any): Observable<any> {
    return this.http.post(`${this.baseURL}/company/`, values, { ...Option, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  masterfile(data: FormData): Observable<any> {
    return this.http.post(`${this.baseURL}/master_upload/`, data, { ...Option, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  rentfile(data: FormData): Observable<any> {
    return this.http.post(`${this.baseURL}/rent_upload/`, data, { ...Option, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  chapterfile(data: FormData): Observable<any> {
    return this.http.post(`${this.baseURL}/chapter6_upload/`, data, { ...Option, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  housefile(data: FormData): Observable<any> {
    return this.http.post(`${this.baseURL}/house_upload/`, data, { ...Option, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }
  downloadFile(url: string): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob',
      observe: 'response'
    });
  }

  download(values: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4=', // Replace with your Base64-encoded credentials
    });
    return this.http.post(`${this.baseURL}/download/`, values, {
      headers: headers,
      responseType: 'blob',

    });
  }


  ocrfiles1(data): Observable<any> {
    return this.http.post(`${this.baseURL}/ocr_rent/`, data).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }
  runMeth(data): Observable<any> {
    return this.http.post("https://idppayroll.myndsolution.com/api/run_meth/", data).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }


  getchapSampleFile(): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const endpoint = `${this.baseURL}/SampleChapter6/`;
    return this.http.get(endpoint, {
      headers: headers,
      observe: 'response',
      responseType: 'blob',
    });
  }

  getrentSampleFile(): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const endpoint = `${this.baseURL}/SampleRent//`;
    return this.http.get(endpoint, {
      headers: headers,
      observe: 'response',
      responseType: 'blob',
    });

  }

  getMasterSampleFile(): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const endpoint = `${this.baseURL}/SampleMaster/`;
    return this.http.get(endpoint, {
      headers: headers,
      observe: 'response',
      responseType: 'blob',
    });
  }

  gethouseSampleFile(): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const endpoint = `${this.baseURL}/SampleHome/`;
    return this.http.get(endpoint, {
      headers: headers,
      observe: 'response',
      responseType: 'blob',
    });
  }

  makeApiRequest() {
    const apiUrl = 'https://idppayroll.myndsolution.com/api/ocr_rent/';

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        console.log('API Response:', data);
        // Handle the API response data here
      },
      (error) => {
        console.error('API Error:', error);
        // Handle any API errors here
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Toast } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IFileDataResponse, IFile_Types } from '../Models/filedata';
import { IAgentQueue, IAgentSummary, IFilterRequest, IFilteredDataResponse, IGeneralData, IMiddle, IUser, IVerify, VerifyFile } from '../Models/generaldata';

@Injectable({
  providedIn: 'root'
})
export class ExtractionStoreService {
  getUser() {
    throw new Error('Method not implemented.');
  }
  loadingInitial = false;
  userName: string = '';
  userId: number = 0;
  FileData: IFileDataResponse | null = null;
  agentQueue: IAgentQueue[] | null = null;
  generalData: IGeneralData | null = null;
  employeeCount = 0;
  company: string = '';
  companySummary: IFilteredDataResponse | null = null;
  agentSummary: IAgentSummary | null = null;
  remarksList: string[] | undefined = [];
  file_type_list: IFile_Types[] | null = null;
  currentFileId: number | null = null;
  agentVerified = 0;
  agentPending = 0;

  constructor(private http: HttpClient, private router: Router) {}

  // setRemarksList(list: string[] | undefined): void {
  //   console.log(list);
  //   this.remarksList = list;
  // }
  // loadWorkList(user: IUser): Observable<IAgentQueue[]> {
  //   if (!!user) {
  //     this.loadingInitial = true;
  //     return this.http.get<IAgentQueue[]>(`/extraction/getQueue/${user.id}`).pipe(
  //       map((queue: IAgentQueue[]) => {
  //         this.agentQueue = queue; // Update this line
  //         this.loadingInitial = false;
  //         return queue;
  //       }),
  //       catchError((error: any) => {
  //         this.loadingInitial = false;
  //         console.log(error);
  //         return throwError(error);
  //       })
  //     );
  //   } else {
  //     return throwError('No user is logged in');
  //   }
  // }


  // loadExtractedFile(id: string): Observable<IFileDataResponse> {
  //   this.loadingInitial = true;
  //   return this.http.get<IFileDataResponse>(`/extraction/getData/${id}`).pipe(
  //     map((fileData: IFileDataResponse) => {
  //       this.FileData = fileData;
  //       this.loadingInitial = false;
  //       this.file_type_list = fileData.file_types;
  //       this.currentFileId = fileData.File_data.id;
  //       this.remarksList = fileData.file_types.find(s => s.filetype === fileData.File_data.filetype_id)?.remarks;
  //       return fileData;
  //     }),
  //     catchError((error: any) => {
  //       this.loadingInitial = false;
  //       console.log(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // loadGeneralData(): Observable<IGeneralData> {
  //   this.loadingInitial = true;
  //   return this.http.get<IGeneralData>('/extraction/getGeneralData').pipe(
  //     map((gData: IGeneralData) => {
  //       this.generalData = gData;
  //       this.loadingInitial = false;
  //       return gData;
  //     }),
  //     catchError((error: any) => {
  //       this.loadingInitial = false;
  //       return throwError(error);
  //     })
  //   );
  // }

  // getAgentStatus(id: number): Observable<{ verified: number; unverified: number }> {
  //   return this.http.get<{ verified: number; unverified: number }>(`/extraction/getAgentStatus/${id}`).pipe(
  //     map((response: { verified: number; unverified: number }) => {
  //       this.agentVerified = response.verified;
  //       this.agentPending = response.unverified;
  //       return response;
  //     }),
  //     catchError(() => {
  //       this.agentVerified = 0;
  //       this.agentPending = 0;
  //       return throwError('Error occurred while fetching agent status');
  //     })
  //   );
  // }

  // getComapnyAgentSummary(values: IFilterRequest): Observable<{ companySummary: IFilteredDataResponse; agentSummary: IAgentSummary }> {
  //   this.loadingInitial = true;
  //   return this.http.post<{ companySummary: IFilteredDataResponse; agentSummary: IAgentSummary }>('/extraction/getSortedData', values).pipe(
  //     map((response: { companySummary: IFilteredDataResponse; agentSummary: IAgentSummary }) => {
  //       this.companySummary = response.companySummary;
  //       this.agentSummary = response.agentSummary;
  //       this.company = values.company;
  //       this.loadingInitial = false;
  //       return response;
  //     }),
  //     catchError((error: any) => {
  //       this.loadingInitial = false;
  //       console.log(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // makeAllocationRequest(values: IMiddle): Observable<any> {
  //   this.loadingInitial = true;
  //   return this.http.post<any>('/extraction/allocate', values).pipe(
  //     map(() => {
  //       this.loadingInitial = false;
  //       // Toast.success('Allocated Successfully');
  //     }),
  //     catchError((error: any) => {
  //       this.getComapnyAgentSummary({
  //         company: values.company,
  //         agent: 0,
  //         filetype: ''
  //       });
  //       this.loadingInitial = false;
  //       // Toast.error(`Error Occurred: ${error.data.Error}`);
  //       console.log(error);
  //       return throwError(error);
  //     })VerifyFile
  //   );
  // }

  // verifyFile(values: IVerify): Observable<any> {
  //   const customRemarks: string | undefined = values.c_remarks?.trim();
  //   const requestData = new VerifyFile(
  //     this.currentFileId!,
  //     values.amountApproved,
  //     values.filetypeActual!,
  //     !customRemarks ? values.remarks! : customRemarks.length <= 0 ? values.remarks! : customRemarks,
  //     this.userId,
  //     values.fromDateActual,
  //     values.toDateActual,
  //     values.metro
  //   );

  //   this.loadingInitial = true;
  //   return this.http.post<any>('/extraction/verify', requestData).pipe(
  //     map((response: any) => {
  //       this.loadingInitial = false;
  //       if (response && !response.Next) {
  //         // Toast.success('Verification successful. End of Queue reached');
  //         this.router.navigateByUrl('/worklist');
  //       } else {
  //         // Toast.success('Verification successful. Loading next file');
  //         this.router.navigateByUrl(`/manage/${response.Next}`);
  //       }
  //       return response;
  //     }),
  //     catchError((error: any) => {
  //       this.loadingInitial = false;
  //       // Toast error('Error Verifying. Please retry or contact support.');
  //       return throwError(error);
  //     })
  //   );
  // }
}

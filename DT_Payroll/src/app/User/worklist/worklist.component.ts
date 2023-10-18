import { NavigationExtras, Router } from '@angular/router';
import { AuthServiceService } from './../../Services/auth-service.service';
import { AppRoutingModule } from './../../app-routing.module';
import { ApiServiceService } from './../../Services/api-service.service';
import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import {
  agent_queue,
  IAllocateResponse,
  IAgentQueueResponse,
  values,
  IAgentQueue,
  IAgentStatus,
  IUser,
} from 'src/app/Models/generaldata';
import { MatTableDataSource } from '@angular/material/table';
import { observable, runInAction } from 'mobx';
const ELEMENT_DATA: IAgentQueue[] = [
];
@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.css'],
})
export class WorklistComponent {
  @observable agentQueue: IAgentQueue[] | null = null;
  vLoading: boolean = true;
  loadingInitial: boolean | any;
  isLoggedIn: boolean | any;
  verified: number | any;
  pending: number | any;
  user: any;
  agent: any = [];
  response: any;
  extractionList: any;
  posts: any[] | any;
  status: IAgentStatus | any;
  id: number | any;
  locals :any = JSON.parse(localStorage.getItem('user') || '{}');
  resdata: any;
  displayedColumns: string[] = ['id', 'filename', 'company', 'action'];
  dataSource :any;
  FileData: any;
  file_type_list: any;
  currentFileId: any;
  remarksList: any;
  element: any;

  constructor(
    private ApiServiceService: ApiServiceService,private AuthServiceService:AuthServiceService,
    private http: HttpClient,private Router:Router,private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = true;
    this.verified = 0;
    this.pending = 0;
    this.id = this.locals.id;
    this.getQueues(this.id);
    this.AgentStatus(this.id);
    this.getCurrentUsers(this.id);
  }

  getQueues(user: IUser) {
    if (!!user) {
      this.loadingInitial = true;
      this.ApiServiceService.getQueue(this.id).subscribe(
        (response: IAgentQueueResponse) => {
          this.agentQueue = response.Queue;
          console.log(response.Queue,'response.Queue');

          this.loadingInitial = false;
          this.dataSource = response.Queue;
          this.vLoading = false;
          console.warn(response);
        },
      );
      setTimeout(() => {
        this.vLoading = false;
      }, 1000);
    }
  }


  getCurrentUsers(user: IUser) {
    this.AuthServiceService.getCurrentUser(this.id).subscribe((data: any) => {
    });
  }


 AgentStatus(id: number) {
    this.ApiServiceService.getAgentStatus(this.id).subscribe(
      (response: IAgentStatus) => {
        this.verified = response.verified;
        this.pending = response.unverified;
        console.log("hello")
      },
      (error) => {
          this.verified = 0;
          this.pending = 0;
        });
 }

 viewQueueItem(id: string): void {
  const navigationExtras: NavigationExtras = {
    queryParams: {
      id: id
    }
  };

  this.Router.navigate(['/manage'], navigationExtras);
  // console.warn('navigationExtras', navigationExtras);
}

}

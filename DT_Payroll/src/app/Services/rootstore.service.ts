
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAgentQueueResponse, IAgentStatus, IAgentSummary, IAllocateResponse, IFilterRequest, IFilteredDataResponse, IGeneralData, IVerifyResponse } from '../Models/generaldata';
import { IFileDataResponse } from '../Models/filedata';
import { ExtractionStoreService } from './extraction-store.service';
import { CommonStoreService } from './common-store.service';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RootStoreService {
  extractionStore: ExtractionStoreService;

  commonStore: CommonStoreService;
  UserstoreService: any;
  rootStore: any;

  constructor(
    private extractionStoreService: ExtractionStoreService,

    private commonStoreService: CommonStoreService,

  ) {
    this.extractionStore = extractionStoreService;
    this.commonStore = commonStoreService;

  }

}

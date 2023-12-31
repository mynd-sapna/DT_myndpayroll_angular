
import { AdminGuard } from './../auth/admin.guard';
// import { PdfViewerModule } from 'ng2-pdf-viewer';

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthServiceService } from './Services/auth-service.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './includes/header/header.component';
import { FooterComponent } from './includes/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotfoundComponent } from './includes/notfound/notfound.component';
import { AllocationComponent } from './Admin/allocation/allocation.component';
import { LoginComponent } from './Dialog Ref/login/login.component';
import { HomepageComponent } from './User/homepage/homepage.component';
import {
  FormsModule,
  FormControl,
  FormBuilder,
  Validators,ReactiveFormsModule
} from '@angular/forms';
import { enableProdMode } from '@angular/core';
import { UploadCompanyComponent } from './User/upload-company/upload-company.component';
import { WorklistComponent } from './User/worklist/worklist.component';
import { PayrollOutputComponent } from './User/payroll-output/payroll-output.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ExtractionStoreService } from './Services/extraction-store.service'; 
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageViewComponent } from './User/manage-view/manage-view.component';
import { VerificationDirective } from './verification.directive';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './Material/material.module';
import { AuthInterceptor } from 'src/auth/auth.interceptor';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImportCompanyComponent } from './Dialog Ref/upload-Files/import-company.component';
import { CreateCompanyComponent } from './Dialog Ref/create-company/create-company.component';
import { CreateuserComponent } from './Dialog Ref/createuser/createuser.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthGuard } from 'src/auth/auth.guard';
import { EjsUploaderComponent } from './ejs-uploader/ejs-uploader.component';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ProcessCompanyComponent } from './Dialog Ref/process-company/process-company.component';
// import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NotfoundComponent,
    LoginComponent,
    CreateuserComponent,
    HomepageComponent,
    UploadCompanyComponent,
    WorklistComponent,
    PayrollOutputComponent,
    AllocationComponent,
    ManageViewComponent,
    VerificationDirective,
    ImportCompanyComponent,
    CreateCompanyComponent,
    EjsUploaderComponent,
    FileViewerComponent,
    DashboardComponent,
    ProcessCompanyComponent,
  ],
  imports: [
  //  NgSelectModule,
    // PdfViewerModule,
    // NgMultiSelectDropDownModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    MaterialModule,MatSnackBarModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
       closeButton: true,
         progressBar: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthServiceService,
    ExtractionStoreService,
    AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }

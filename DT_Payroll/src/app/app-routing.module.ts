import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ManageViewComponent } from './User/manage-view/manage-view.component';
import { PayrollOutputComponent } from './User/payroll-output/payroll-output.component';
import { WorklistComponent } from './User/worklist/worklist.component';
import { UploadCompanyComponent } from './User/upload-company/upload-company.component';
import { HomepageComponent } from './User/homepage/homepage.component';
import { NotfoundComponent } from './includes/notfound/notfound.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocationComponent } from './Admin/allocation/allocation.component';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoginComponent } from './Dialog Ref/login/login.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'manage/:id', component: ManageViewComponent },
  // { path: 'manage', component: ManageViewComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: 'allocation', component: AllocationComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: 'process-company', component: UploadCompanyComponent, canActivate: [AuthGuard] },
  { path: 'worklist', component: WorklistComponent, canActivate: [AuthGuard] },
  { path: 'download', component: PayrollOutputComponent, canActivate: [AuthGuard] },
  {path: '', component:LoginComponent},
  { path: '**', component: NotfoundComponent },
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/admin/admin.module').then((m) => m.AdminModule),
  // },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

}



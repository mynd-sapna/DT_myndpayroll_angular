import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportCompanyComponent } from 'src/app/Dialog Ref/export-company/export-company.component';
import { ManageViewComponent } from 'src/app/User/manage-view/manage-view.component';
import { PayrollOutputComponent } from 'src/app/User/payroll-output/payroll-output.component';
import { UploadCompanyComponent } from 'src/app/User/upload-company/upload-company.component';
import { WorklistComponent } from 'src/app/User/worklist/worklist.component';
import { NotfoundComponent } from 'src/app/includes/notfound/notfound.component';

const routes: Routes = [
    { path: 'manage', component: ManageViewComponent },
    { path: 'create-company', component: UploadCompanyComponent },
    { path: 'worklist', component: WorklistComponent, canActivate: [] },
    { path: 'download', component: PayrollOutputComponent },
    { path: 'export-company', component: ExportCompanyComponent },
    { path: '**', component: NotfoundComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }


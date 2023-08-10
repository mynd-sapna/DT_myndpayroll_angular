
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocationComponent } from 'src/app/Admin/allocation/allocation.component';
import { HomepageComponent } from 'src/app/User/homepage/homepage.component';
import { NotfoundComponent } from 'src/app/includes/notfound/notfound.component';

const routes: Routes = [
  {
    path: '', // Set the parent route to an empty string
    component: AllocationComponent,
    children: [
      { path: 'allocation', component: AllocationComponent },
      { path: '**', component: NotfoundComponent },
    ],
  },
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

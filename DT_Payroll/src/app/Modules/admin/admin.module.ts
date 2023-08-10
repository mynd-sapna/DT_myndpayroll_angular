import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/Material/material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AllocationComponent } from 'src/app/Admin/allocation/allocation.component';
import { NotfoundComponent } from 'src/app/includes/notfound/notfound.component';
import { CreateuserComponent } from 'src/app/Dialog Ref/createuser/createuser.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    // AllocationComponent,
    // NotfoundComponent,
    // CreateuserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    NgMultiSelectDropDownModule,
    MatSnackBarModule, // This import is not needed since it's already in MaterialModule
  ],
  providers: [
    DatePipe,
  ],
})
export class AdminModule { }

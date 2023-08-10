import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule, Routes } from '@angular/router';
@NgModule({
  declarations: [ManageViewComponent
],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})

export class UserModule {}


import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from "./../../Services/api-service.service";
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';
import { Component, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { CreateCompanyComponent } from './../../Dialog Ref/create-company/create-company.component';
import { ImportCompanyComponent } from '../../Dialog Ref/upload-Files/import-company.component';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { company } from 'src/app/Models/generaldata';


@Component({
  selector: 'app-export-company',
  templateUrl: './export-company.component.html',
  styleUrls: ['./export-company.component.css']
})
export class ExportCompanyComponent {

  dataSource: MatTableDataSource<company> = new MatTableDataSource<company>([]);
  displayedColumns: string[] = ['s.no.', 'company name', 'file type', 'action'];
  constructor(public dialog: MatDialog, private route: Router, private apiservice: ApiServiceService, private http: HttpClient,) {
    const companiesData: company[] = [
      { id: 1, companyName: 'Company A', fileType: 'CSV', editMode: false, editCompanyName: '', editFileType: '' },
      { id: 2, companyName: 'Company B', fileType: 'PDF', editMode: false, editCompanyName: '', editFileType: '' },
      { id: 3, companyName: 'Company C', fileType: 'Excel', editMode: false, editCompanyName: '', editFileType: '' },
      { id: 3, companyName: 'Company C', fileType: 'Excel', editMode: false, editCompanyName: '', editFileType: '' },
    ];
    this.dataSource.data = companiesData;
    //       this.dataSource = new MatTableDataSource<Company>([]);
  }

  uploadFile() {
    const dialogRef = this.dialog.open(ImportCompanyComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result: any) => { });
  }
  createCompany() {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      data: {},
    });

    dialogRef.componentInstance.companyCreated.subscribe((newCompany: company) => {
      newCompany.id = this.dataSource.data.length + 1;

      // Add the new company to the table data source
      this.dataSource.data.push(newCompany);
      this.dataSource.data = [...this.dataSource.data];
    });
  }

  editCompany(company: company) {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      data: { company: { ...company } }, // Pass the selected company details to the component
    });

    dialogRef.componentInstance.companyCreated.subscribe((updatedCompany: company) => {
      // Update the company details in the table upon form submission
      const index = this.dataSource.data.findIndex((c) => c.id === updatedCompany.id);
      if (index !== -1) {
        this.dataSource.data[index] = { ...updatedCompany };
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }

  saveCompanyEdit(company: company) {
    company.editMode = false;
    company.companyName = company.editCompanyName;
    company.fileType = company.editFileType;
  }

  cancelCompanyEdit(company: company) {
    company.editMode = false;
  }
}


import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/Models/generaldata';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CreateCompanyComponent } from '../create-company/create-company.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgIfContext } from '@angular/common';
import { tap, catchError, throwError } from 'rxjs';
@Component({
  selector: 'app-process-company',
  templateUrl: './process-company.component.html',
  styleUrls: ['./process-company.component.css']
})
export class ProcessCompanyComponent {
  @Output() companyCreated = new EventEmitter<Company>();
  createcompForm: FormGroup | any;
  isLoading: boolean | any;
  submitError: string | null = null;
  dropdownSettings: IDropdownSettings | any;
  loadingTemplate: TemplateRef<NgIfContext<boolean>>;
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private toast: ToastrService, private http: HttpClient,
    private dialogRef: MatDialogRef<CreateCompanyComponent>,
  ) {
    this.createcompForm = this.formBuilder.group({
      company: ['', Validators.required],
      fileType: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.getgeneraldata();
    this.dropdownSettings = {
      singleSelection: true,
      textField: "name",
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
    };

  }
  getgeneraldata() {
    this.apiService.getGeneralData().subscribe((companies: any) => {
      this.data = companies;
    });
  }
  process_file(): void {
    const selectedCompany = this.createcompForm.get('company')?.value[0].name;
    console.warn("companyname", selectedCompany)
    if (selectedCompany.length > 0) {
      const form = new FormData;
      form.append('company_name', selectedCompany);
      var request = { company_name: selectedCompany }

      this.apiService.ocrfiles1(form)
        .pipe(
          tap((response) => {
            console.warn("ocr done", response)
            // this.toast.success('OCR done successfully', 'Success', { timeOut: 1000 });
          }),
          catchError((error) => {
            this.isLoading = false;
            console.log(error);
            return throwError(error);
          })
        )
        .subscribe(
          () => {
            this.apiService.runMeth(form)
              .pipe(
                catchError((error) => {
                  this.isLoading = false;
                  console.log(error);
                  return throwError(error);
                })
              )
              .subscribe((response) => {
                console.warn('meth run', response)
                this.toast.success('Files are underprocess, you will receive a mail confirmation once its done', 'Success', { timeOut: 5000 });
                this.isLoading = false;
              });
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
          }
        );
    }
  }
}

import { AuthServiceService } from './../../Services/auth-service.service';
import { ApiServiceService } from './../../Services/api-service.service';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NEVER, of } from 'rxjs';
import { IVerify, IVerifyResponse, VerifyFile, IAgentQueueResponse, IUser } from 'src/app/Models/generaldata'
import { ActivatedRoute, Router } from '@angular/router';
import { IFileDataResponse, IFile_Types } from 'src/app/Models/filedata';
import { Observer } from 'rxjs';
import { observable, values } from 'mobx';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-view',
  templateUrl: './manage-view.component.html',
  styleUrls: ['./manage-view.component.css'],
})
export class ManageViewComponent implements OnInit {
  @ViewChild('imageElement', { static: true }) imageElement: ElementRef<HTMLImageElement> | any;
  panelform: FormGroup | any;
  textareaValue: string = '';
  selectedOption: any;
  vertices = [];
  total = 0;
  undoValue: number | null = null;
  filepath = 'image/path';
  previousValue: null | any;
  clipboardService: any;
  filelst: any;
  extractForm: any;
  companyForm: any;
  verifyForm: any;
  rootStore: any;
  loadingInitial: boolean = false;
  currentFileId: number | any;
  datas: any;
  exform: any;
  loading: boolean | any;
  filelstset: IVerifyResponse | any;
  submitting: boolean | any;
  invalid: any;
  localStorageId: string | any;
  queryParamId: string | any;
  user: any;
  remarksList: any;
  fileData: IFileDataResponse | any;
  @observable file_type_list: IFile_Types[] | null = null;
  Filetype: any;
  extension: string = '';
  files: string[] = [];
  numOfFiles: number = 0;
  otherform: FormGroup | any;
  locals: any = JSON.parse(localStorage.getItem('user') || '{}');
  constructor(
    private formBuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, private AuthServiceService: AuthServiceService, private toast: ToastrService,
    private ApiServiceService: ApiServiceService, private http: HttpClient) {
    //panel form
    this.panelform = this.formBuilder.group({
      name: [{ value: '', disabled: true }],
      empCode: [{ value: '', disabled: true }],
      declaredAmount: [{ value: '', disabled: true }],
      dateFrom: [{ value: '', disabled: true }],
      dateTo: [{ value: '', disabled: true }]
    });
    //extraction form
    this.extractForm = this.formBuilder.group({
      amountApproved: ['', Validators.required],
      filetypeActual: ['', Validators.required],
      fromDateActual: [''],
      toDateActual: [''],
      metro: [''],
      remarks: ['', Validators.required],
      c_remarks: [''],
    });
    //other form data
    this.otherform = this.formBuilder.group({
      Ref_No: [''],
      Metro: [''],
      UpdatedOn: [''],
      UpdatedBy: [''],
      CreatedOn: [''],
      CreatedBy: [''],
      RowVersion: [''],
      Rent_Address: [''],
      LL_Name: [''],
      LL_Address: ['']
    });
    this.loading = false;
  }
  isRentFileTypeSelected(): boolean {
    const fileType = this.extractForm.get('filetypeActual')?.value;
    return fileType && fileType.toLowerCase() === 'rent';
  }
  ngOnInit(): void {
    this.localStorageId = JSON.parse(localStorage.getItem('user') || '{}');
    this.localStorageId = this.localStorageId.id;
    console.log('localStorageId:', this.localStorageId);
    this.route.queryParams.subscribe(params => {
      this.queryParamId = params['id'];
      console.log('queryParamId:', this.queryParamId);
      this.loadExtractedFile(this.queryParamId);
      const fileId = params['fileId'];
    });
  }
  loadExtractedFile(id: string): void {
    this.ApiServiceService.getData(id).subscribe(
      (fileData: any) => {
        if (this.imageElement && this.fileData && this.fileData.filepath) {
          this.imageElement.nativeElement.src = this.fileData.filepath;
        }
        this.fileData = fileData;
        console.log(fileData.employee_data.name)
        this.panelform.patchValue({
          name: fileData.employee_data.name,
          empCode: fileData.employee_data.empCode,
          declaredAmount: fileData.inv_data.declaredAmount,
          dateFrom: fileData?.inv_data?.fromDate ? fileData.inv_data.fromDate.split(" ")[0] : '',
          dateTo: fileData?.inv_data?.toDate ? fileData.inv_data.toDate.split(" ")[0] : '',
        });
        this.extractForm.patchValue({
          amountApproved: !fileData.File_data.extractedData
            ? 0
            : fileData.File_data.extractedData.val,
          filetypeActual: !fileData.File_data
            ? null
            : fileData.File_data.filetype_id,
          remarks: !fileData.File_data ? null : fileData.File_data.remarks,
          fromDateActual: !fileData.inv_data.fromDate
            ? null
            : fileData.inv_data.fromDate.split(' ')[0],
          toDateActual: !fileData.inv_data.toDate
            ? null
            : fileData.inv_data.toDate.split(' ')[0],
          metro: !fileData.inv_data.otherData.Metro
            ? null
            : fileData.inv_data.otherData.Metro,
          c_remarks: null,
        });
        this.otherform.patchValue({
          Ref_No: this.fileData.inv_data.otherData.Ref_No,
          Metro: this.fileData.inv_data.otherData.Metro,
          UpdatedOn: this.fileData.inv_data.otherData.UpdatedOn,
          UpdatedBy: this.fileData.inv_data.otherData.UpdatedBy,
          CreatedOn: this.fileData.inv_data.otherData.CreatedOn,
          CreatedBy: this.fileData.inv_data.otherData.CreatedBy,
          RowVersion: this.fileData.inv_data.otherData.RowVersion,
          Rent_Address: this.fileData.inv_data.otherData.Rent_Address,
          LL_Name: this.fileData.inv_data.otherData.LL_Name,
          LL_Address: this.fileData.inv_data.otherData.LL_Address
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onSubmit() {
    if (this.panelform.valid) {
      const values = this.panelform.value;
      console.warn(this.panelform.values)
    }
  }
  Exsubmit() {
    this.submitting = true;
    if (this.extractForm.invalid) {
      this.invalid = true;
      return;
    }
  }
  setRemarksList(list: string[] | undefined): void {
    console.log(list);
    this.remarksList = list;
  }
  // verifyFile(): void {
  //   if (this.extractForm.valid) {
  //     const values = this.extractForm.value;
  //     const customRemarks: string | any = values.c_remarks?.trim();
  //     const requestData = {
  //       currentFileId: this.fileData.File_data.id,
  //       amountApproved: values.amountApproved,
  //       filetypeActual: values.filetypeActual,
  //       remarks: !customRemarks
  //         ? values.remarks
  //         : customRemarks.length <= 0
  //           ? values.remarks
  //           : customRemarks,
  //       userId: 'this.id', // Replace with the actual user ID
  //       fromDateActual: values.fromDateActual,
  //       toDateActual: values.toDateActual,
  //       metro: values.metro
  //     };
  //     this.ApiServiceService.verify(values).subscribe(
  //       (response: any) => {
  //         if (response && !response.Next) {
  //           this.toastr.success('Verification successful. End of Queue reached');
  //           this.router.navigate(['/worklist']);
  //         } else {
  //           this.toastr.success('Verification successful. Loading next file');
  //           this.router.navigate([`/manage/${response.Next}`]);
  //         }
  //       },
  //       (error: any) => {
  //         this.toastr.error('Error Verifying. Please retry or contact support.');
  //       }
  //     );
  //   }
  // }
  verifyFile(): void {
    if (this.extractForm.valid) {
      const values = this.extractForm.value;
      const customRemarks: string | any = values.c_remarks?.trim();
      const requestData = {
        id: this.fileData.File_data.id,
        approvedAmount: values.amountApproved,
        approved: true,
        agent: this.localStorageId,
        filetypeActual: values.filetypeActual,
        remarks: !customRemarks
          ? values.remarks
          : customRemarks.length <= 0
            ? values.remarks
            : customRemarks,
        fromDateActual: values.fromDateActual,
        toDateActual: values.toDateActual,
        metro: values.metro
      };
      this.ApiServiceService.verify(requestData).subscribe(
        (response: any) => {
          if (response && !response.Next) {
            // End of Queue reached
            this.toast.success('Verification successful. End of Queue reached');
            this.router.navigate(['/worklist']); // Navigate to '/worklist' route
          } else if (response && response.Next) {
            // Next file available in the queue
            this.toast.success('Verification successful. Loading next file');
            this.router.navigate(['/manage'], { queryParams: { id: response.Next } });
          }
        },
        (error: any) => {
          this.toast.error('Error Verifying. Please retry or contact support.');
        }
      );
    }
  }

  isDateVerified(): boolean {
    return this.fileData.File_data.extractedData?.is_date || false;
  }
  isNameVerified(): boolean {
    return this.fileData.File_data.extractedData?.is_name || false;
  }
  isAmountVerified(): boolean {
    return this.fileData.File_data.extractedData?.is_val || false;
  }
  copyTotal() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    const imageUrl = "https://images.template.net/wp-content/uploads/2017/02/28085413/Cover-Letter-for-Job-Application-in-Doc.jpg";
    this.clipboardService.copyFromContent(imageUrl);
  }
  updateValue(newValue: any) {
    this.previousValue = this.total;
    this.total = newValue;
  }
  undo() {
    if (this.previousValue !== undefined) {
      this.total = this.previousValue;
      this.previousValue = undefined;
    }
  }
  zoomIn() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    const zoomFactor = 1.2;
    image.style.width = `${image.offsetWidth * zoomFactor}px`;
    image.style.height = `${image.offsetHeight * zoomFactor}px`;
  }
  zoomOut() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    const zoomFactor = 0.8;
    image.style.width = `${image.offsetWidth * zoomFactor}px`;
    image.style.height = `${image.offsetHeight * zoomFactor}px`;
  }
  rotate() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    const currentRotation =
      parseFloat(
        image.style.transform.replace('rotate(', '').replace('deg)', '')
      ) || 0;
    const rotationIncrement = 90;
    const newRotation = currentRotation + rotationIncrement;
    image.style.transform = `rotate(${newRotation}deg)`;
  }
  addToTotal() {
    if (this.filepath !== '*.*,*') {
      window.open(this.filepath, '_blank');
    }
  }
  clearTotal() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    image.src = 'image/path';
  }
  getPdfUrl(file: string) {
    // return `${process.env['']}/static/${file}`;
  }

  getImageUrl(file: string) {
    // return `${process.env}/api/verification_view/?id=${file}`;
  }
  validateForm() {
    this.invalid = this.extractForm.invalid;
  }

}


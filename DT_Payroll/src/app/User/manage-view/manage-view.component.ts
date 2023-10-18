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
  imageUrl: string; // Define the image URL
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
  Filetype: any;
  extension: string = '';
  files: string[] = [];
  numOfFiles: number = 0;
  otherform: FormGroup | any;
  locals: any = JSON.parse(localStorage.getItem('user') || '{}');
  id: any;
  fileContent: Blob | undefined;
  remark: any;
  baseUrl: string = 'https://idppayroll.myndsolution.com'
  imageHistory: any;

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

  ngOnInit(): void {
    this.extractForm.valueChanges.subscribe((formData) => {
      this.panelform.patchValue({
        remarks: this.fileData.File_data.remarks,
      });
      console.log(formData, 'wdd');
    });
    this.extractForm.valueChanges.subscribe((formData) => {
      this.panelform.patchValue({
        remarks: this.fileData.File_data.remarks,
      });
      console.log(formData, 'wdd');
    });
    this.localStorageId = JSON.parse(localStorage.getItem('user') || '{}');
    this.localStorageId = this.localStorageId.id;
    console.log('localStorageId:', this.localStorageId);
    this.route.queryParams.subscribe(params => {
      this.queryParamId = params['id'];
      console.log('queryParamId:', this.queryParamId);
      this.loadExtractedFile(this.queryParamId);
      const fileId = params['fileId'];
    });
    this.extension = '';
    this.files = [];
    this.numOfFiles = 0;
    console.log(this.queryParamId, 'this.queryParamId');
    this.id = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.id, 'this.id');
    this.setRemarksFromIndex(0);
    console.log();

  }

  getImageUrl(file: string): string {
    return `${'https://idppayroll.myndsolution.com'}/static/${file}`;
  }

  uploadFile(file: any) {

    this.ApiServiceService.getQueue(this.id.id).subscribe(
      (response: any) => {
        // console.log(response.Queue, 'response.Queue');
        for (const obj of response.Queue) {
          // console.log(obj, 'obj.id');
          // console.log(this.queryParamId, 'this.queryParamId');
          if (obj.id == this.queryParamId) {
            // console.log(obj.filename, 'obj.filename');
          }
        }
      },
    );
  }



  getimges() {
    if (!!this.user) {
      this.ApiServiceService.getData(this.id.id).subscribe(
        (response: any) => {
          console.log(response.Queue, 'response.Queue');
          for (const obj of response.Queue) {
            console.log(obj, 'obj.id');
            console.log(this.queryParamId, 'this.queryParamId');
            if (obj.id == this.queryParamId) {
              console.log(obj.filename, 'obj.filename');
            }
          }
        },
      );
    }
  }

  loadExtractedFile(id: string): void {
    console.log(id, 'id');
    this.ApiServiceService.getData(id).subscribe(
      (fileData: any) => {
        if (this.imageElement && this.fileData && this.fileData.filepath) {
          this.imageElement.nativeElement.src = this.fileData.filepath;
        }
        this.fileData = fileData;
        const startIndex = this.filepath.indexOf("/images/");
        console.log(fileData, 'fileData');
        console.log(fileData.filepath, 'fileData');
        console.log(fileData.employee_data.name)
        console.log(fileData?.inv_data?.remarks, 'fileData?.inv_data?.fromDate')
        this.panelform.patchValue({
          name: fileData.employee_data.name,
          empCode: fileData.employee_data.empCode,
          declaredAmount: fileData.inv_data.declaredAmount,
          dateFrom: fileData?.inv_data?.fromDate ? fileData.inv_data.fromDate.split(" ")[0] : '',
          dateTo: fileData?.inv_data?.toDate ? fileData.inv_data.toDate.split(" ")[0] : '',
        });
        // this.fileType(fileData.filetype_id
        //   );
        for (let index = 0; index < this.fileData.file_types.length; index++) {
          const element = this.fileData.file_types[index];
          console.log(element, 'elementt');
          if (this.fileData.file_types[index].filetype == fileData.File_data.filetype_id) {
            this.remark = this.fileData.file_types[index].remarks
            console.log(this.remark, 'this.remark');
          }
        }

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
        if (this.imageElement && fileData && fileData.filepath) {
          this.imageElement.nativeElement.src = fileData.filepath;
          console.log();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


  fileType(file: any) {
    console.log('hyy');
    console.log(file.target.value, 'file.target.value');
    console.log(this.fileData.file_types, 'this.fileData.file_types');
    for (let index = 0; index < this.fileData.file_types.length; index++) {
      const element = this.fileData.file_types[index];
      console.log(element, 'element');
      if (this.fileData.file_types[index].filetype == file.target.value) {
        this.remark = this.fileData.file_types[index].remarks
      }
    }
  }

  setRemarksFromIndex(index: number): void {
    if (this.fileData && this.fileData.file_types && this.fileData.file_types.length > index) {
      this.extractForm.patchValue({
        remarks: this.fileData.file_types[index].remarks,

      });
    }
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
            setTimeout(() => {
              window.location.reload();
            }, 500);
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
    if (this.filepath) {
      const image: HTMLImageElement = this.imageElement.nativeElement;
      const imageUrl = this.baseUrl + this.fileData.File_data.filepath;
      this.clipboardService.copyFromContent(imageUrl);
    }
  }

  updateValue(newValue: any) {
    this.previousValue = this.total;
    this.total = newValue;
  }


  clearTotal() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    this.imageHistory.push(image.src); // Save the current image src to the history
    image.src = 'image/path';
  }

  undo() {
    const image: HTMLImageElement = this.imageElement.nativeElement;
    if (this.imageHistory.length > 0) {
      // Get the previous image src from the history and remove it from the history
      const previousImageSrc = this.imageHistory.pop();
      image.src = previousImageSrc;
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



  validateForm() {
    this.invalid = this.extractForm.invalid;
  }

  openImageInNewTab(): void {
    if (this.filepath) {
      window.open(this.baseUrl + this.fileData.File_data.filepath, '_blank');
    }
  }
}


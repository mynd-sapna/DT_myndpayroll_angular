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
  firstFile: any = '';
  //  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  @ViewChild('imageElement', { static: true }) imageElement: ElementRef<HTMLImageElement> | any;
  imageUrl: string; // Define the image URL
  panelform: FormGroup | any;
  textareaValue: string = '';
  selectedOption: any;
  vertices = [];
  total = 0;
  undoValue: number | null = null;
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
  baseUrls: string = 'https://idppayroll.myndsolution.com/var/DT_mynd_payroll/mynd_payroll/api/static/'
  imageHistory: any;
  filepath: any;
  isPdf: boolean;
  viewFile: boolean = false;
  src="https://idppayroll.myndsolution.com/var/DT_mynd_payroll/mynd_payroll/api/static/images/SPG/SPG-510632684-282911-INV_LIP-007001-534913-PolicyStatus_919447804_.pdf"
  pdfSrc = 'https://idppayroll.myndsolution.com/var/DT_mynd_payroll/mynd_payroll/api/static/images/SPG/SPG-510632684-282911-INV_LIP-007001-534913-PolicyStatus_919447804_.pdf';
  // src: string;
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
      amountApproved:  [{ value: '', disabled: true }],
      filetypeActual: ['', Validators.required],
      fromDateActual: [''],
      toDateActual: [''],
      metro: [''],
      remarks: ['', Validators.required],
      c_remarks: ['', Validators.required],
    });
    //other form data
    this.otherform = this.formBuilder.group({
      Ref_No: [{ value: '', disabled: true }],
      Metro: [{ value: '', disabled: true }],
      UpdatedOn: [{ value: '', disabled: true }],
      UpdatedBy: [{ value: '', disabled: true }],
      CreatedOn: [{ value: '', disabled: true }],
      CreatedBy: [{ value: '', disabled: true }],
      RowVersion: [{ value: '', disabled: true }],
      Rent_Address: [{ value: '', disabled: true }],
      LL_Name:[{ value: '', disabled: true }],
      LL_Address: [{ value: '', disabled: true }],
    });
    this.loading = false;
    this.fileExtension;
  }

  ngOnInit(): void {
    this.extractForm.valueChanges.subscribe((formData) => {
      this.panelform.patchValue({
        remarks: this.fileData.File_data.remarks,
      });
      console.log(formData, 'wdd');
    });
    this.route.paramMap.subscribe((params: any) => {
      this.queryParamId = params?.params['id'];
      console.log('queryParamId:', this.queryParamId);
      this.loadExtractedFile(this.queryParamId);
      const fileId = params['fileId'];
    });
    this.localStorageId = JSON.parse(localStorage.getItem('user') || '{}');
    this.localStorageId = this.localStorageId.id;
    console.log('localStorageId:', this.localStorageId);
  }
  handleLoadError(event: any) {
    console.error('Error loading PDF:', event);
  }
  // firstFile: any;
  get fileExtension(): string {
    this.firstFile = '';
    const filePath = this.fileData?.File_data?.filepath;
    if (filePath) {
      const files = filePath.split("*,*");
      if (files.length > -1) {
        this.firstFile = files[0];
        this.src = `https://idppayroll.myndsolution.com/var/DT_mynd_payroll/mynd_payroll/api/static/${this.firstFile}`
        const extension = this.firstFile.split('.').pop();
        if (extension) {
          console.warn('Full File Path:', this.src);
          return extension.toLowerCase();
        }
        this.viewFile = true;
      }
      // this.src + this.firstFile;

      console.warn("src",this.src ,this.viewFile);

    }
    return '';
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
            this.toast.success('Verification successful. Loading next file');
            this.router.navigate(['manage', response.Next]).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 500);
            });
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


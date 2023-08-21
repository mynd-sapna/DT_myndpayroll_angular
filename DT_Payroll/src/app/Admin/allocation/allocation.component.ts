import { AuthServiceService } from './../../Services/auth-service.service';
import {
  IGeneralData,
  values,
  Company,
  IAllocateResponse,
  IFilteredDataResponse,
  IAgentSummary,
  IMiddle,
  IUser,
} from "./../../Models/generaldata";
import { ApiServiceService } from "./../../Services/api-service.service";
import { ExtractionStoreService } from "src/app/Services/extraction-store.service";
import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import {
  IAgentQueueResponse,
  IFilterRequest,
} from "src/app/Models/generaldata";
import { __values } from "tslib";
import { section } from "src/app/Models/sectionoption";
import { catchError, finalize, tap, throwError } from "rxjs";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { HttpClient } from "@angular/common/http";
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { observable, runInAction } from 'mobx';
import { ToastrService } from 'ngx-toastr';
interface fileType {
  data1: string;
  data2: number;
  data3: number;
}

@Component({
  selector: "app-allocation",
  templateUrl: "./allocation.component.html",
  styleUrls: ["./allocation.component.css"],
})

export class AllocationComponent implements OnInit {

  section = [
    {
      key: "HomeLoan&Others",
      text: "Interest on Home Loan & Other Income",
      value: "Interest on Home Loan & Other Income",
    },
    {
      key: "DedUnder80C",
      text: "Deduction Under Chapter VI - A (u/s 80C)",
      value: "Deduction Under Chapter VI - A (u/s 80C)",
    },
    {
      key: "Rent",
      text: "House Rent Allowance",
      value: "House Rent Allowance",
    },
    {
      key: "DedNon80C",
      text: "Ded Under Chapter VI-A (Other Then 80C)",
      value: "Ded Under Chapter VI-A (Other Then 80C)",
    },
  ];
  @observable agentSummary: IAgentSummary |any
  dropdownSettings: IDropdownSettings | any;
  dropdownSettingsa: IDropdownSettings | any;
  dropdownSettingsb: IDropdownSettings | any;
  dropdownSettingsc: IDropdownSettings | any;
  dropdownList: [] | any;
  Loading: false | any;
  userVerified = 0;
  totalAllo = 0;
  totalUnallo = 0;
  totalVerified = 0;
  totalSAllo = 0;
  totalSUnallo = 0;
  totalSVerified = 0;
  userpending = 0;
  selectedOption = section[0].value;
  selectedValue: any;
  companyForm: FormGroup<any> | any;
  dirtySinceLastSubmit: boolean = false;
  allocateForm: any;
  submitting: false | any;
  companySection: any;
  totalFiles: number | any;
  companysection: any;
  ELEMENT_DATA: any;
  data: any;
  sectionlist: any;
  response: any;
  isLoading: true | any;
  selectedCompany:any;
  isFormDisabled: any;
  selectedItems: any[] = [];
  values: any;
  id: number | any;
  locals: any = JSON.parse(localStorage.getItem('user') || '{}');
  companySummary: |any;
  total:any;
  constructor(
    private formBuilder: FormBuilder,
    private AuthServiceService: AuthServiceService,
    private apiservice: ApiServiceService,private toast: ToastrService
  ) {
    this.companyForm = this.formBuilder.group({
      company: ['', Validators.required],
    });
    this.allocateForm = this.formBuilder.group({
      company: ['', Validators.required],
      // filetype: ['', Validators.required],
      // filesection: ['', Validators.required],

      agent: ['', Validators.required],
      count: ['', Validators.required],
    });
  }

  showToast() {
    this.toast.success('Hello, I am a toast!', 'Success');
  }


  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownSettingsa = {
      singleSelection: false,
      textField: 'filetype',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownSettingsb = {
      singleSelection: false,
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.id = this.locals.id;
    this.getCurrentUsers(this.id);
    this.getgeneraldata();
  }

  getgeneraldata() {
    this.apiservice.getGeneralData().subscribe((data: any) => {
      this.dropdownList = data;
    });
  }

  getCurrentUsers(user: IUser) {
    this.AuthServiceService.getCurrentUser(this.id).subscribe((data: any) => {
    });
  }
  get company() {
    return this.allocateForm.get("company");
  }
  /*on submit comapny method*/
  onSubmit(): void {
    // if (this.companyForm.invalid) {
    //   return;
    // }
    // const selectedCompany = this.companyForm.get('company')?.value;
    // console.log('Selected Company:', selectedCompany);
  }

  onItemSelect(company: any): void {
    const selectedCompany = this.companyForm.get('company')?.value;
  if (selectedCompany.length > 0) {
    // Extract the first element of the selectedCompany array
    const companyValue = selectedCompany[0].name;
    this.isLoading = true;
    const values: IFilterRequest = {
      company: companyValue
    };
    this.apiservice.getSortedData(values)
      .pipe(
        tap((response: IFilteredDataResponse) => {
          this.companySummary = response;
          this.calculateTotals();
          console.log("iles are HeaderRowOutlet",response)
        }),
        catchError((error) => {
          this.isLoading = false;
          console.log(error);
          return throwError(error);
        })
      )
      .subscribe(
        () => {
          this.apiservice.getComapnyAgentSummary(selectedCompany.map((index:any)=>(index.name)))
            .pipe(
              catchError((error) => {
                this.isLoading = false;
                console.log(error);
                return throwError(error);
              })
            )
            .subscribe((response: IAgentSummary) => {
              this.agentSummary = response.Data;
              this.values = values.company;
              this.calculateUserPending();
              console.log('dccea',response)
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


  calculateUserPending() {
    this.userpending = this.agentSummary.reduce((total: any, queueItem: { allocated: any; }) => {
      return total + (queueItem.allocated ? queueItem.allocated : 0);
    }, 0);
  }

  /*on submit allocation method*/
  onallocate(): void {
    if (this.allocateForm.invalid) {
      return;
    }

    const formValues = this.allocateForm.value;
    const payload: IMiddle = {
      company: formValues.company[0].name,
      section: formValues.filesection,
      filetype: formValues.filetype,
      agent: 60,
      assign_agent: formValues.assign_agent,
      count: formValues.count,
    };

    console.log("formvalues", formValues);
    this.Loading = true;

    this.apiservice.Allocate(payload).subscribe(
      () => {
        this.Loading = false;
        this.toast.success('Allocated Successfully'); // Show success toast message
      },
      (error) => {
        this.Loading = false;
        this.toast.error('Error Occured- Number of files to assign must be less than the total!'); // Show error toast message
        console.log(error);
      }
    );
  }

  isFormValid(): boolean {
    return this.allocateForm.valid;
  }

  iscompanyFormValid(): boolean {
    return this.companyForm.valid;
  }

  calculateTotals(): void {
    this.totalAllo = 0;
    this.totalUnallo = 0;
    this. totalVerified = 0;
    this. totalSAllo = 0;
    this.totalSUnallo = 0;


    if (this.companySummary && this.companySummary.File_counts) {
      for (const files of this.companySummary.File_counts) {
        for (const file of files.Files) {
          this.totalFiles += (file.allocated ? file.allocated : 0) +
            (file.unallocated ? file.unallocated : 0) +
            (file.verified ? file.verified : 0);
          this.totalAllo += file.allocated ? file.allocated : 0;
          this.totalUnallo += file.unallocated ? file.unallocated : 0;
          this.totalVerified += file.verified ? file.verified : 0;
        }
      }
    }
  }

}

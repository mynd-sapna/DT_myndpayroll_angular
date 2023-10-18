import { IEmployeeData, IFileData, IFile_Types, InvData } from "./filedata";

export interface Filetype {
  id: number;
  filetype: string;
}

export interface ICompany {
  id: number;
  name: string;
}

export interface IAgent {
  id: number;
  username: string;
}

export interface IGeneralData {
  Success: string;
  Filetypes: Filetype[];
  Companies: ICompany[];
  Agents: IAgent[];
}

export interface IFilterRequest {
  company: string;
}

export interface IAllocateRequest {
  agent?: number;
  company: string;
  filetype?: string;
  assign_agent: number;
  count: number;
}


export interface IMiddle {
	company: string;
	section: string | null
	filetype: string | null;
	agent: number | null;
	assign_agent: number;
	count: number;
}
export interface FileCountsUnallocated {
  filetype: string;
  allocated: number;
  unallocated: number;
  verified: number;
}

export class AllocationRequest implements IAllocateRequest {
  agent?: number;
  company: string;
  filetype?: string;
  assign_agent: number;
  count: number;

  constructor(
    company: string,
    assign_agent: number,
    count: number,
    agent?: number,
    filetype?: string
  ) {
    this.agent = agent;
    this.company = company;
    this.filetype = filetype;
    this.assign_agent = assign_agent;
    this.count = count;
  }
}

export interface IFilteredDataResponse {
  File_counts: IFilecount[];
  File_counts_section: IFilecountssection[];
  Success: string;
  Total: number;
}

export interface IFilecountssection {
  filetype__section: string;
  allocated: number;
  unallocated: number;
  verified: number;
}


export interface IFile {
  filetype: string;
  allocated: number;
  unallocated: number;
  verified: number;
}

export class VerifyFile {
  id: number;
  approvedAmount: number;
  approved = true;
  filetype: string;
  remarks: string;
  agent: number;
  fromDateActual?: string | null;
  toDateActual?: string | null;
  metro?: string | null;

  constructor(
    file_id: number,
    amount: number,
    file_type: string,
    remarks: string,
    agent_id: number,
    fromDate: string | null,
    toDate: string | null,
    metro: string | null
  ) {
    this.id = file_id;
    this.approvedAmount = amount;
    this.filetype = file_type;
    this.remarks = remarks;
    this.agent = agent_id;
    this.fromDateActual = fromDate;
    this.toDateActual = toDate;
    this.metro = metro;
  }
}
// export interface IVerifyResponse {
//   blob(): void;
//   status: number;
//   Success: string;
//   Next: boolean | number;
// }
export interface IAllocateResponse {
  Success: string;
}
export interface IDatum {
  agent: string;
  allocated: number;
  verified: number;
}
export interface IAgentSummary {
  Success: string;
  Data: IDatum[];
}
export interface IAgentQueue {
  id: number;
  filename: string;
  company: string;
}
export interface IAgentQueueResponse {
  data: any;
  Success: string;
  Queue: IAgentQueue[];
}
export interface IAgentQueueRequest {
  agent: number;
}
export interface IAgentStatus {
  verified: number;
  unverified: number;
  Success: string;
}
export interface FileData {
  id: number;
  filename: string;
  // Add other properties as needed
}
export interface agentQueue {
  verified: number;
  unverified: number;
  Success: string;
}
export interface AgentQueueRequets {
  verified: number;
  unverified: number;
  Success: string
}
export interface eOptions {
  key: string;
  text: string;
  value: string;
}
const validate = (values: any) => {
  let errors: any = {};
  if (!values.company) {
    errors.company = 'Company is required';
  }
  return errors;
};
export interface Company {
  id: string;
  name: string;
  type: string;
}
export interface Filetype {
  id: number;
  name: string;
}
export interface Filesection {
  id: string;
  name: string;
}
export interface Agenttoassign {
  name: string;
}
export interface Agent {
  id: number;
  username: string;
}

export interface IAllocateRequest {
  agent?: number;
  company: string;
  filetype?: string;
  assign_agent: number;
  count: number;
}

export interface FileCountsUnallocated {
  filetype: string;
  allocated: number;
  unallocated: number;
  verified: number;
}


export interface IFilecountssection {
  filetype__section: string;
  allocated: number;
  unallocated: number;
  verified: number;
}
export interface IFilecount {
  section: string;
  Files: IFile[];
}
export interface IFile {
  filetype: string;
  allocated: number;
  unallocated: number;
  verified: number;
}
export interface IUser {
  token: string;
  username: string;
  id: number;
  admin: boolean;
}

export interface IUserFormValues {
  username:  string;
  password  : string;
}

export interface IVerify {
  amountApproved: number;
  filetypeActual: string | null;
  remarks: string | null;
  fromDateActual: string | null;
  toDateActual: string | null;
  metro: string | null;
  c_remarks: string | null;

}
export interface IVerifyResponse {
  Success: string;
  Next: boolean | number;
}
export interface IFileDataResponse {
  employee_data: IEmployeeData;
  inv_data: InvData;
  Success: string;
  File_data: IFileData;
  file_types: IFile_Types[];
}
export interface IUserLogoutRequest {
  id: number;
}

export interface IUser {
  id: number;
  admin: boolean;
  password: string;
}
export interface CUser {
  username:string;
  password: string;
}
export interface company{
    id: any;
    companyName: string;
    fileType: string;
    editMode: boolean;
    editCompanyName: string;
    editFileType: string;
}
export interface agent_queue {
  position: number;
  filename: string;
  company: string;
  action: string;
  success: string;
}
export interface Idownload{
  company:string;
   fileType:string;
}
export interface values {
  success: boolean;
  message: string;
  data: any;
}
export interface user {
  name: string;
}
export interface IDownloadPayload {
  company: string;
  type: string;
}
export class Verifyreq {
	id: number |any;
	approvedAmount: number | any;
	approved = true;
	filetype: string |any;
	remarks: string |any;
	agent: number |any;
	fromDateActual?: string | null;
	toDateActual?: string | null;
	metro?: string | null;
}


export class AllocaitonRequest implements IAllocateRequest {
	agent?: number;
	company: string;
	filetype?: string;
	assign_agent: number;
	count: number;

	constructor(
		company: string,
		assign_agent: number,
		count: number,
		agent?: number,
		filetype?: string
	) {
		this.agent = agent;
		this.company = company;
		this.filetype = filetype;
		this.assign_agent = assign_agent;
		this.count = count;
	}
}
export interface IAllocateRequest {
  company: string;
  assign_agent: number;
  count: number;
  agent?: number;
  filetype?: string;
}
export class AgentQueueRequest {
  agent: number;

  constructor(agent: number) {
    this.agent = agent;
  }

}


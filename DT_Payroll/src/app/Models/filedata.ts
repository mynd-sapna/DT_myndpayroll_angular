export interface InvData {
  id: number;
  employee_id: number;
  declaredAmount: number;
  otherData: IOtherData;
  filetype_id: number;
  attDocRnt: string;
  fromDate: string;
  toDate: string;
  fromDateActual: string;
  toDateActual: string;
  metro: string;
}
export interface IEmpData {
  PAYDATE: string;
  DOJ: string;
  PANNO: string;
  DIVI_CODE: string;
  DOL: string;
  SET_DATE: string;
  LTYPE: string;
}
export interface IEmployeeData {
  id: number;
  empCode: string;
  name: string;
  company_id: string;
  empData: string;
}

export interface IFileData {
  id: number;
  filename: string;
  filepath: string;
  fullOcr: string;
  vertices: string;
  isVerified: boolean;
  botVerified: boolean;
  approved: boolean;
  remarks: string | null;
  extractedData: IExtractedData;
  updatedAt: string;
  createdAt: string;
  approvedAmount: number | null;
  agent_id: number;
  filetype_id: string;
  employee_id: number;
  company_id: string;
}
export interface IOtherOtherData {
  Dec_Amt: number;
  Ref_No: string;
  UpdatedBy: string;
  UpdatedOn: string;
  CreatedOn: string;
  CreatedBy: string;
  RowVersion: string;
  AttDocInv: string;
}
export interface IOtherData {
  Ref_No: string;
  Metro: string;
  UpdatedBy: string;
  UpdatedOn: string;
  CreatedOn: string;
  CreatedBy: string;
  RowVersion: string;
  Rent_Address: string;
  LL_Name: string;
  LL_Address: string;
  LL_PANNo: string;
  AttDocLLPAN: string;
}
export interface IExtractedData {
  is_date: boolean;
  is_name: boolean;
  is_val: boolean;
  val: number;
}
export interface IFile_Types {
  filetype: string;
  remarks: string[];
}
export interface IFileDataResponse {
  employee_data: IEmployeeData;
  inv_data: InvData;
  Success: string;
  File_data: IFileData;
  file_types: IFile_Types[];
}
export interface IGetFileDataRequest {
  id: number;
}

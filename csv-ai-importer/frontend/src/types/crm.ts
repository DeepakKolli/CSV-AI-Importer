export type CRMStatus = 
  | 'GOOD_LEAD_FOLLOW_UP' 
  | 'DID_NOT_CONNECT' 
  | 'BAD_LEAD' 
  | 'SALE_DONE';

export type CRMDataSource = 
  | 'leads_on_demand' 
  | 'meridian_tower' 
  | 'eden_park' 
  | 'varah_swamy' 
  | 'sarjapur_plots' 
  | '';

export interface CRMRecord {
  created_at: string; // ISO date or valid date string
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CRMStatus | '';
  crm_note: string;
  data_source: CRMDataSource;
  possession_time: string;
  description: string;
}

export interface ImportSummary {
  totalRecords: number;
  importedRecords: number;
  skippedRecords: number;
}

export interface ImportResult {
  records: CRMRecord[];
  skipped: {
    rowNumber: number;
    reason: string;
    rawRecord: Record<string, string>;
  }[];
  summary: ImportSummary;
}

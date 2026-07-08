import { GeminiService } from './gemini';
import { CRMRecord, ImportResult, CRMStatus, CRMDataSource } from '../types/crm';

const ALLOWED_STATUSES = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
const ALLOWED_DATA_SOURCES = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];

export class ImportService {
  private static BATCH_SIZE = 50;

  /**
   * Processes all raw CSV records by batching and calling Gemini AI for mapping,
   * then validating and formatting the resulting CRM records.
   */
  public static async processImport(rawRecords: Record<string, string>[]): Promise<ImportResult> {
    const totalRecords = rawRecords.length;
    const finalRecords: CRMRecord[] = [];
    const skippedRecords: ImportResult['skipped'] = [];

    // 1. Create batches of raw records to prevent LLM context overflow and respect rate limits
    const batches: Record<string, string>[][] = [];
    for (let i = 0; i < rawRecords.length; i += this.BATCH_SIZE) {
      batches.push(rawRecords.slice(i, i + this.BATCH_SIZE));
    }

    console.log(`[Import Service] Starting import of ${totalRecords} records in ${batches.length} batches.`);
    const maxRetries = 3;
    const retryDelayMs = 2000;

    // Helper for sleep/delay
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // 2. Process each batch sequentially (safer for Gemini rate limits)
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const startRowIndex = batchIndex * this.BATCH_SIZE + 1;
      let mappedBatch: CRMRecord[] | null = null;
      let attempt = 1;
      let lastError: any = null;

      // Retry loop
      while (attempt <= maxRetries && !mappedBatch) {
        try {
          console.log(`[Import Service] Batch ${batchIndex + 1}/${batches.length} - Attempt ${attempt}/${maxRetries} - Sending to Gemini AI...`);
          
          mappedBatch = await GeminiService.mapRecords(batch);
          
          console.log(`[Import Service] Batch ${batchIndex + 1}/${batches.length} - Attempt ${attempt}/${maxRetries} - Success!`);
        } catch (error: any) {
          lastError = error;
          console.warn(
            `[Import Service] Batch ${batchIndex + 1}/${batches.length} - Attempt ${attempt}/${maxRetries} failed. ` +
            `Error: ${error.message || 'Unknown error'}`
          );

          if (attempt < maxRetries) {
            console.log(`[Import Service] Waiting ${retryDelayMs / 1000}s before next attempt...`);
            await sleep(retryDelayMs);
          }
          attempt++;
        }
      }

      // If mapping was successful, validate and format each record
      if (mappedBatch) {
        try {
          for (let itemIndex = 0; itemIndex < mappedBatch.length; itemIndex++) {
            const record = mappedBatch[itemIndex];
            const currentRow = startRowIndex + itemIndex;
            const originalRecord = batch[itemIndex] || {};

            // Validate required fields: Must have email OR mobile number
            const email = record.email ? record.email.trim() : '';
            const mobile = record.mobile_without_country_code ? String(record.mobile_without_country_code).trim() : '';

            if (!email && !mobile) {
              skippedRecords.push({
                rowNumber: currentRow,
                reason: 'Record contains neither email nor mobile number (rule requirement).',
                rawRecord: originalRecord
              });
              continue;
            }

            // Enforce ENUM validation for crm_status
            let status: CRMStatus | '' = '';
            if (record.crm_status && ALLOWED_STATUSES.includes(record.crm_status)) {
              status = record.crm_status as CRMStatus;
            }

            // Enforce ENUM validation for data_source
            let dataSource: CRMDataSource = '';
            if (record.data_source && ALLOWED_DATA_SOURCES.includes(record.data_source)) {
              dataSource = record.data_source as CRMDataSource;
            }

            // Enforce date validity for created_at
            let createdAtStr = record.created_at;
            if (!createdAtStr || isNaN(Date.parse(createdAtStr))) {
              createdAtStr = new Date().toISOString();
            }

            // Standardize record structure
            const validatedRecord: CRMRecord = {
              created_at: createdAtStr,
              name: record.name ? record.name.trim() : 'Unknown',
              email: email,
              country_code: record.country_code ? record.country_code.trim() : '',
              mobile_without_country_code: mobile,
              company: record.company ? record.company.trim() : '',
              city: record.city ? record.city.trim() : '',
              state: record.state ? record.state.trim() : '',
              country: record.country ? record.country.trim() : '',
              lead_owner: record.lead_owner ? record.lead_owner.trim() : '',
              crm_status: status,
              crm_note: record.crm_note ? record.crm_note.trim() : '',
              data_source: dataSource,
              possession_time: record.possession_time ? record.possession_time.trim() : '',
              description: record.description ? record.description.trim() : ''
            };

            finalRecords.push(validatedRecord);
          }
        } catch (postError: any) {
          console.error(`[Import Service] Unexpected post-processing error in batch ${batchIndex + 1}:`, postError);
        }
      } else {
        // If all retries failed, log all records in the batch as skipped
        const errMessage = lastError?.message || 'Gemini API batch processing failed after all retries.';
        console.error(`[Import Service] Batch ${batchIndex + 1}/${batches.length} failed completely. Skipping batch.`);
        
        batch.forEach((rawRec, offset) => {
          skippedRecords.push({
            rowNumber: startRowIndex + offset,
            reason: `Batch mapping failed: ${errMessage}`,
            rawRecord: rawRec
          });
        });
      }
    }

    return {
      records: finalRecords,
      skipped: skippedRecords,
      summary: {
        totalRecords,
        importedRecords: finalRecords.length,
        skippedRecords: skippedRecords.length
      }
    };
  }
}

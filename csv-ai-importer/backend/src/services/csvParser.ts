import Papa from 'papaparse';

export interface ParsedCSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export class CSVParserService {
  /**
   * Parses a CSV file buffer and returns raw rows and headers.
   */
  public static parse(buffer: Buffer): ParsedCSVData {
    const csvString = buffer.toString('utf8');
    
    const parseResult = Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: 'greedy'
    });

    if (parseResult.errors.length > 0) {
      // Log errors but don't fail completely if we got some records
      console.warn('[CSV Parser] Errors occurred during parsing:', parseResult.errors);
    }

    const headers = parseResult.meta.fields || [];
    const rows = parseResult.data || [];

    return {
      headers,
      rows
    };
  }
}

import { Request, Response } from 'express';
import { CSVParserService } from '../services/csvParser';
import { ImportService } from '../services/importService';

export class ImportController {
  /**
   * Endpoint to upload a CSV file and return parsed preview data.
   * POST /api/upload
   */
  public static async uploadCSV(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file uploaded or file format is invalid.' });
        return;
      }

      const parsedData = CSVParserService.parse(req.file.buffer);
      
      // Return headers, total count, and a subset (top 20 rows) for front-end preview
      const previewRows = parsedData.rows.slice(0, 20);

      res.status(200).json({
        success: true,
        filename: req.file.originalname,
        headers: parsedData.headers,
        previewRows: previewRows,
        totalRows: parsedData.rows.length,
        // Also send back all the records so that the client can post them to /api/import
        // Or client can re-submit the file, but sending all parsed records is faster and maintains statelessness.
        allRows: parsedData.rows 
      });
    } catch (error: any) {
      console.error('[Import Controller] Upload Error:', error);
      res.status(500).json({ success: false, error: error.message || 'An error occurred during file upload.' });
    }
  }

  /**
   * Endpoint to process parsed records using Gemini mapping and validation.
   * POST /api/import
   */
  public static async importRecords(req: Request, res: Response): Promise<void> {
    try {
      const { records } = req.body;

      if (!records || !Array.isArray(records)) {
        res.status(400).json({ success: false, error: 'Invalid payload. "records" array is required.' });
        return;
      }

      if (records.length === 0) {
        res.status(400).json({ success: false, error: 'No records found to import.' });
        return;
      }

      const importResult = await ImportService.processImport(records);

      res.status(200).json({
        success: true,
        ...importResult
      });
    } catch (error: any) {
      console.error('[Import Controller] Import Error:', error);
      res.status(500).json({ success: false, error: error.message || 'An error occurred during import processing.' });
    }
  }
}

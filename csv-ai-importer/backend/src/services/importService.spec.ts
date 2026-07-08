import { ImportService } from './importService';
import { GeminiService } from './gemini';

// Mock the GeminiService to control API responses and simulate failures
jest.mock('./gemini');

describe('ImportService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CSV Post-AI Validations & Filtering', () => {
    it('should successfully map and import valid records', async () => {
      // Mock Gemini success response
      const mockMappedLeads = [
        {
          name: 'Alice Cooper',
          email: 'alice@example.com',
          mobile_without_country_code: '9876543210',
          crm_status: 'GOOD_LEAD_FOLLOW_UP',
          data_source: 'leads_on_demand',
          created_at: '2026-07-08T12:00:00Z',
        }
      ];
      (GeminiService.mapRecords as jest.Mock).mockResolvedValue(mockMappedLeads);

      const rawInput = [
        { name: 'Alice', email: 'alice@example.com', phone: '9876543210' }
      ];

      const result = await ImportService.processImport(rawInput);

      expect(result.summary.importedRecords).toBe(1);
      expect(result.summary.skippedRecords).toBe(0);
      expect(result.records[0].name).toBe('Alice Cooper');
      expect(result.records[0].crm_status).toBe('GOOD_LEAD_FOLLOW_UP');
    });

    it('should skip a record if it contains neither email nor mobile number', async () => {
      const mockMappedLeads = [
        {
          name: 'Ghost Lead',
          email: '',
          mobile_without_country_code: '',
          crm_status: 'GOOD_LEAD_FOLLOW_UP',
          created_at: '2026-07-08T12:00:00Z',
        }
      ];
      (GeminiService.mapRecords as jest.Mock).mockResolvedValue(mockMappedLeads);

      const rawInput = [
        { name: 'Ghost', email: '', phone: '' }
      ];

      const result = await ImportService.processImport(rawInput);

      expect(result.summary.importedRecords).toBe(0);
      expect(result.summary.skippedRecords).toBe(1);
      expect(result.skipped[0].reason).toContain('neither email nor mobile number');
    });

    it('should fallback to default status and date if AI returns invalid status or missing date', async () => {
      const mockMappedLeads = [
        {
          name: 'Bob Dylan',
          email: 'bob@example.com',
          crm_status: 'INVALID_STATUS_CODE', // Invalid Status code
          created_at: 'bad-date-format',     // Invalid Date
        }
      ];
      (GeminiService.mapRecords as jest.Mock).mockResolvedValue(mockMappedLeads);

      const rawInput = [
        { name: 'Bob', email: 'bob@example.com' }
      ];

      const result = await ImportService.processImport(rawInput);

      expect(result.summary.importedRecords).toBe(1);
      expect(result.records[0].crm_status).toBe(''); // falls back to empty string
      expect(isNaN(Date.parse(result.records[0].created_at))).toBe(false); // falls back to current Date
    });
  });

  describe('Gemini AI Batch Retry Logic', () => {
    it('should retry on failure and succeed if a subsequent attempt is successful', async () => {
      // Mock Gemini to fail on the first attempt, then succeed on the second
      (GeminiService.mapRecords as jest.Mock)
        .mockRejectedValueOnce(new Error('API quota exceeded / network glitch'))
        .mockResolvedValueOnce([
          {
            name: 'Resilient Lead',
            email: 'resilient@example.com',
            mobile_without_country_code: '1234567890',
            crm_status: 'GOOD_LEAD_FOLLOW_UP',
            created_at: '2026-07-08T12:00:00Z',
          }
        ]);

      const rawInput = [{ name: 'Resilient', email: 'resilient@example.com' }];

      const result = await ImportService.processImport(rawInput);

      // Verify it called Gemini twice
      expect(GeminiService.mapRecords).toHaveBeenCalledTimes(2);
      expect(result.summary.importedRecords).toBe(1);
      expect(result.summary.skippedRecords).toBe(0);
    });

    it('should skip the batch if all 3 retry attempts fail', async () => {
      // Mock Gemini to fail on all 3 attempts
      (GeminiService.mapRecords as jest.Mock)
        .mockRejectedValue(new Error('Rate limit or connection timeout'));

      const rawInput = [
        { name: 'Failed Lead 1', email: 'fail1@example.com' },
        { name: 'Failed Lead 2', email: 'fail2@example.com' }
      ];

      const result = await ImportService.processImport(rawInput);

      // Verify it called Gemini 3 times (max retries)
      expect(GeminiService.mapRecords).toHaveBeenCalledTimes(3);
      expect(result.summary.importedRecords).toBe(0);
      expect(result.summary.skippedRecords).toBe(2); // both rows in the batch are skipped
      expect(result.skipped[0].reason).toContain('Batch mapping failed');
    });
  });
});

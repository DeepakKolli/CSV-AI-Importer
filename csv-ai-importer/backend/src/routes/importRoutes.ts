import { Router } from 'express';
import { ImportController } from '../controllers/importController';
import { upload } from '../middlewares/upload';

const router = Router();

// Route for CSV upload and preview
router.post('/upload', upload.single('file'), ImportController.uploadCSV);

// Route for AI mapping and importing
router.post('/import', ImportController.importRecords);

export default router;

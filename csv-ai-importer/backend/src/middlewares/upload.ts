import multer from 'multer';
import { Request } from 'express';

// In-memory storage configuration
const storage = multer.memoryStorage();

// File filter to ensure only CSV files are uploaded
const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const isCsv = 
    file.mimetype === 'text/csv' || 
    file.mimetype === 'application/vnd.ms-excel' ||
    file.originalname.endsWith('.csv');

  if (isCsv) {
    callback(null, true);
  } else {
    callback(new Error('Only CSV files are allowed!'));
  }
};

// Multer upload middleware configuration (Max 10MB)
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

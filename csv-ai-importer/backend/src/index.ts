import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import importRoutes from './routes/importRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support larger payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount API routes
app.use('/api', importRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'GrowEasy CSV AI Importer API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

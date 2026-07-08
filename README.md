<img width="432" height="975" alt="image" src="https://github.com/user-attachments/assets/52e22b49-2352-4c45-8d4a-7dc6f3a41863" /># CSV-AI-Importer
Project Overview :
The AI-Powered CSV Importer is a web application built as part of the GrowEasy Software Developer Assignment. The main objective of this project is to simplify the process of importing lead data into GrowEasy CRM by allowing users to upload CSV files from different sources such as Facebook Ads, Google Ads, Excel sheets, Real Estate portals, or any manually created spreadsheet.

Since every CSV file can have different column names and formats, the application uses Google Gemini AI to intelligently identify, map, and transform the uploaded data into GrowEasy's standard CRM schema. This removes the need for manual column mapping and significantly reduces the time required to import lead data.

The application follows a clean Frontend → Backend → AI → Response architecture, where the frontend handles CSV upload and preview, the backend validates and processes records in batches, and Gemini AI performs intelligent field mapping before returning standardized CRM records.

The project is built with a focus on clean architecture, modular code, responsive UI, batch processing, proper error handling, and a production-ready user experience, making it easy to maintain, extend, and integrate into a real-world CRM workflow.


Feature
AI-Powered Field Mapping – Uses Google Gemini AI to intelligently identify and map different CSV column names into GrowEasy's standard CRM schema, reducing the need for manual mapping.
CSV Upload & Preview – Allows users to upload CSV files from different sources and preview the data before importing, helping verify records before processing.
Batch Processing – Processes records in batches (50 records per batch) to efficiently handle large datasets while maintaining stable AI requests.
Automatic Retry Mechanism – If an AI request fails due to temporary issues such as rate limits or network errors, the backend automatically retries before marking the batch as failed.
Real-Time API Status – Displays the backend connection status and API latency, allowing users to quickly verify that the application is connected and ready for import.
Interactive Results Dashboard – Shows imported records, skipped records, summary statistics, and detailed processing results after the import is completed.
Responsive User Interface – Built with a clean, modern interface supporting both Light and Dark themes to provide a consistent user experience across desktop and mobile devices.
Error Handling & Validation – Validates uploaded CSV files, handles invalid or missing data gracefully, and provides meaningful error messages throughout the import process.
Stateless Architecture – Designed without a database, allowing each import to be processed independently while keeping the application lightweight and easy to deploy.

Architecture Overview
                  ┌──────────────┐
                  │   CRM User   │
                  └──────┬───────┘
                         │
                  Upload CSV
                         │
                         ▼
          ┌────────────────────────┐
          │ Next.js Frontend        │
          │ - Upload               │
          │ - Preview              │
          │ - Results              │
          └──────────┬─────────────┘
                     │
             POST /api/import
                     │
                     ▼
          ┌────────────────────────┐
          │ Express Backend        │
          │ - Validation          │
          │ - Batch Processing    │
          │ - Response Formatting │
          └──────────┬─────────────┘
                     │
             Gemini API
                     │
                     ▼
          ┌────────────────────────┐
          │ Google Gemini AI       │
          └──────────┬─────────────┘
                     │
             Standard CRM JSON
                     │
                     ▼
          ┌────────────────────────┐
          │ Results Dashboard      │
          └────────────────────────┘



Tech Stack :
Frontend -
  Technology                Purpose                                             |
Lucide React         | Lightweight and consistent icon library             
PapaParse            | Client-side CSV parsing and preview generation      
Tailwind CSS         | Responsive and modern UI styling                    
TypeScript           | Type-safe and maintainable frontend development     
Next.js (App Router) | Building the user interface and application routing 

Backend -
 Technology             Purpose
Jest              | Unit testing and API testing                         
Multer            | Handling uploaded CSV files                          
Google Gemini API | AI-powered CSV field mapping and data transformation 
TypeScript        | Type-safe backend development                        
Express.js        | REST API development and request handling            
Node.js           | JavaScript runtime for the backend                   

Folder structure : 
csv-ai-importer/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Express route controllers
│   │   ├── middlewares/      # Multer file size configuration
│   │   ├── prompts/          # Gemini System Instructions & Mapping JSON rules
│   │   ├── routes/           # Routing (/api/import, /api/health)
│   │   ├── services/         # Business logic (Gemini batching, retries)
│   │   ├── types/            # CRM schemas and execution type safety
│   │   └── index.ts          # Backend entry point
│   ├── jest.config.js        # Jest testing configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js layout, pages, and global CSS
│   │   ├── components/       # UI components (UploadZone, Tables, ApiStatus)
│   │   └── types/            # Frontend interfaces
│   └── package.json
└── README.md

API's 
create 2 API's for this 
1) GET /api/health
Checks the operational status of the backend server.

2)POST /api/import
Receives a raw array of JSON objects (parsed from CSV) and returns standardized CRM records.



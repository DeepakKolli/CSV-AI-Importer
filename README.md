# AI-Powered CSV Importer

## Project Overview

This project was developed as part of the GrowEasy Software Developer Assignment. The main goal of this application is to make importing lead data into GrowEasy CRM easier by allowing users to upload CSV files from different sources such as Facebook Ads, Google Ads, Excel sheets, Real Estate portals, or any manually created spreadsheet.

Since every CSV file has different column names and data formats, the application uses Google Gemini AI to understand the uploaded data and map it into GrowEasy's standard CRM format. This removes the need for manually mapping columns before importing.

The application follows a simple flow where the user uploads a CSV file, previews the data, confirms the import, and the backend processes the records in batches before sending them to Gemini AI. After processing, the application displays the imported records, skipped records, and the overall import summary.

The project was built by focusing on clean architecture, modular code, proper error handling, responsive UI, and a simple user experience.

---

## Features

- Upload CSV files from different sources.
- Preview uploaded records before importing.
- AI-powered field mapping using Google Gemini.
- Batch processing for handling large datasets.
- Automatic retry for temporary AI request failures.
- Import summary with imported and skipped records.
- Real-time backend status check.
- Responsive user interface with Light and Dark themes.
- Proper validation and error handling.
- Stateless architecture without using a database.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js | User Interface |
| TypeScript | Type Safety |
| Tailwind CSS | UI Styling |
| PapaParse | CSV Parsing |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | REST APIs |
| TypeScript | Type Safety |
| Google Gemini API | AI Field Mapping |
| Multer | File Upload Handling |
| Jest | Unit Testing |

---

## Architecture Overview

```text
CRM User
    │
Upload CSV
    │
    ▼
Next.js Frontend
    │
Preview CSV
    │
Confirm Import
    │
    ▼
Express Backend
    │
Validate Records
    │
Create Batches
    │
Google Gemini AI
    │
Standard CRM Records
    │
    ▼
Results Dashboard
```

---

## Folder Structure

```text
csv-ai-importer/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── package.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── types/
│   └── package.json
│
└── README.md
```

---

## API Documentation

### GET /api/health

Checks whether the backend server is running.

### Response

```json
{
  "status": "OK"
}
```

---

### POST /api/import

Receives parsed CSV records, processes them using Gemini AI, and returns standardized CRM records.

### Request

```json
[
  {
    "Name": "John Doe",
    "Phone": "+91 9876543210"
  }
]
```

### Response

```json
{
  "success": true,
  "imported": [],
  "skipped": [],
  "summary": {
    "total": 100,
    "imported": 95,
    "skipped": 5
  }
}
```

# G-Scores Backend

Backend API for the 2024 Vietnam National High School Exam (THPT) score lookup and reporting system.

## Assignment Requirements

Build a web application that:

- Imports the provided `diem_thi_thpt_2024.csv` dataset into a database.
- Allows users to search exam scores by registration number.
- Generates score distribution reports with four score levels:
  - ≥ 8
  - 6 ≤ score < 8
  - 4 ≤ score < 6
  - < 4
- Displays statistics for all subjects.
- Shows the Top 10 students in Group A (Mathematics, Physics, Chemistry).

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://g-score.vercel.app |
| Backend API | https://gscores.up.railway.app |

## Overview

This project provides a REST API for searching THPT 2024 exam scores and generating statistical reports from a dataset containing approximately one million records.

The application imports raw CSV data into MongoDB and exposes endpoints for score lookup, score distribution analysis, and Group A rankings.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB Atlas
- Mongoose
- CSV streaming import (`csv-parse`)
- Railway (deployment)

## Project Structure

```
src/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── seeders/
├── utils/
├── app.ts
└── index.ts
```

The project follows a layered architecture:

- **Controllers** handle HTTP requests.
- **Services** contain business logic and reporting calculations.
- **Models** manage database interaction through Mongoose.
- **Seeders** import the CSV dataset into MongoDB.

## Data Import

The provided CSV file contains approximately 1,000,000 student records.

To efficiently process this dataset:

- CSV data is streamed instead of loaded entirely into memory.
- Records are inserted using MongoDB bulk operations.
- Batch processing is used to improve import performance.

## Running the Project

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas URI and CSV path, then import the dataset:

```bash
npm run seed
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run production build:

```bash
npm start
```

## API Endpoints

Base URL (production): `https://gscores.up.railway.app/api`

### Health Check

```http
GET /api/health
```

Checks whether the server is running.

### Score Lookup

```http
GET /api/scores/:sbd
```

Returns all exam scores for a given registration number.

**Example:**

```http
GET /api/scores/01000001
```

### Subject Distribution

```http
GET /api/reports/distribution?subject=toan
```

Returns score distribution statistics for a specific subject.

**Valid `subject` values:** `toan`, `ngu_van`, `ngoai_ngu`, `vat_li`, `hoa_hoc`, `sinh_hoc`, `lich_su`, `dia_li`, `gdcd`

**Score bands:**

- ≥ 8 (`gte8`)
- 6 ≤ score < 8 (`from6to8`)
- 4 ≤ score < 6 (`from4to6`)
- < 4 (`lt4`)

### Distribution of All Subjects

```http
GET /api/reports/distribution/all
```

Returns score distributions for every subject.

### Top 10 Group A Students

```http
GET /api/reports/top-group-a
```

Returns the top 10 students ranked by:

**Mathematics + Physics + Chemistry**

## Features Implemented

- ✅ Import CSV dataset into MongoDB
- ✅ Score lookup by registration number
- ✅ Score distribution reports
- ✅ Statistics for all subjects
- ✅ Top 10 Group A ranking
- ✅ RESTful API architecture
- ✅ TypeScript support
- ✅ Production deployment on Railway

## Notes

- The CSV dataset is intentionally excluded from version control.
- MongoDB Atlas is used as the production database.
- The backend is deployed on Railway and connected to the same database used during the import process.
- This repository contains **backend only**; the frontend is deployed separately on Vercel.

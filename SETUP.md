# ES Lanka Travels - Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- Python 3.13.3 (or compatible version)
- MongoDB

## Backend Setup
1. Install Python dependencies:
```bash
cd backend
pip install scikit-learn pandas numpy joblib python-dotenv
```

2. Install Node.js dependencies:
```bash
cd backend
npm install
```

3. Start backend server:
```bash
npm run dev
```

## Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start frontend server:
```bash
npm run dev
```

## Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Important Notes
- Make sure MongoDB is running
- The backend uses a Python ML model for tour generation
- All required model files should be in `backend/ml/models/` 










cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
cd backend; npm install; npm run dev
cd frontend; npm install; npm run dev

# MarkEv Backend Deployment Guide

## Render.com Deployment Steps

### 1. Environment Variables to Set in Render:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: 5000 (or let Render auto-assign)
- `NODE_ENV`: production

### 2. Build Command:
```
npm install
```

### 3. Start Command:
```
npm start
```

### 4. Health Check Endpoint:
```
GET /api/health
```

## Local Testing Commands:
```bash
cd backend
npm install
npm start
```

## API Endpoints:
- `GET /api/chargers/all` - Get all chargers
- `GET /api/chargers/nearby` - Get chargers in bounds
- `POST /api/chargers/seed` - Seed sample data

# UIMP Development Guide

## 🚀 Quick Start (No Database Required)

### Backend Server (Mock Mode)
```bash
cd server
npm run dev:mock
```
✅ **This starts the mock server on port 3001 with sample data**

### Frontend Server
```bash
cd client  
npm run dev
```
✅ **This starts the Next.js frontend on port 3000**

## ⚠️ Important Commands

### ✅ CORRECT Commands to Use:

**Backend (Server Directory):**
- `npm run dev:mock` - Starts mock server (no database needed)
- `npm run build` - Build for production
- `npm run test` - Run tests

**Frontend (Client Directory):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests

### ❌ AVOID These Commands (Require Database):

**Backend (Server Directory):**
- `npm run dev` - Requires PostgreSQL database
- `npm run start` - Requires database setup

## 🔧 Current Setup Status

- ✅ **Mock Server**: Running on http://localhost:3001
- ✅ **Frontend**: Should run on http://localhost:3000
- ✅ **Authentication**: Works with any email/password
- ✅ **API Endpoints**: All functional with mock data
- ❌ **Database**: Not required for development

## 🎯 Development Workflow

1. **Start Backend**: `cd server && npm run dev:mock`
2. **Start Frontend**: `cd client && npm run dev`
3. **Open Browser**: http://localhost:3000
4. **Test Login**: Use any email/password combination

## 🐛 Troubleshooting

### If you see "Can't reach database server at localhost:5432"
- You're running `npm run dev` instead of `npm run dev:mock`
- Stop the process (Ctrl+C) and use `npm run dev:mock`

### If port 3001 is in use
- Check what's running: `netstat -ano | findstr :3001`
- Kill the process: `taskkill /PID [PID_NUMBER] /F`
- Restart mock server: `npm run dev:mock`

### If frontend can't connect to backend
- Ensure mock server is running on port 3001
- Check http://localhost:3001/api/health
- Restart both servers if needed

## 📝 Mock Data Features

The mock server provides:
- **Authentication**: Login/signup with any credentials
- **Applications**: Sample internship applications
- **Feedback**: Mock mentor feedback
- **Dashboard**: Student/mentor/admin dashboards
- **All API Endpoints**: Fully functional without database

## 🔄 Switching to Real Database (Optional)

If you want to use a real PostgreSQL database:

1. **Start PostgreSQL** (Docker or local installation)
2. **Configure Environment**: Update `.env` with database URL
3. **Run Migrations**: `npm run prisma:migrate`
4. **Start Real Server**: `npm run dev`

But for development and testing, the mock server is sufficient!
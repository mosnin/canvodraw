# Realtime Collaborative Drawing App

A production-ready real-time collaborative drawing web application with persistent canvases. Users can create or join rooms and draw together in real-time with touch and mouse support.

## Features

- Real-time collaborative drawing
- Room-based collaboration
- Persistent canvases across page refreshes
- Mobile-responsive design with touch support
- Multiple color and stroke width options
- WebSocket-based real-time communication
- PostgreSQL persistence

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- WebSockets
- HTML5 Canvas with Pointer Events API

### Backend
- Node.js
- Express
- WebSockets (ws)
- PostgreSQL

## Project Structure

```
canvodraw/
├── backend/
│   ├── routes/
│   │   └── rooms.js
│   ├── db.js
│   ├── server.js
│   ├── ws.js
│   ├── migrations.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Canvas.jsx
│   │   ├── RoomSelector.jsx
│   │   ├── api.js
│   │   ├── socket.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database and run migrations:
```bash
psql -U postgres -d your_database -f migrations.sql
```

4. Set environment variables:
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
export PORT=3000
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables (create `.env` file):
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Railway Deployment

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with this code

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL instance and set the `DATABASE_URL` environment variable

### Step 3: Run Database Migrations

1. Click on the PostgreSQL service
2. Go to the "Data" tab
3. Click "Query"
4. Copy and paste the contents of `backend/migrations.sql`
5. Click "Run Query"

### Step 4: Deploy Backend

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your repository
3. **CRITICAL**: Configure the Root Directory:
   - Click on the newly created service
   - Go to "Settings" tab
   - Scroll to "Service Settings"
   - Set **Root Directory** to `backend`
   - Railway will automatically detect the Node.js app and use nixpacks.toml

4. Go to "Variables" tab and configure:
   - `DATABASE_URL` - Click "Add Reference" → Select PostgreSQL service → DATABASE_URL
   - `NODE_ENV` - Add new variable with value `production`

5. Go to "Settings" tab:
   - Under "Networking", click "Generate Domain" to enable public access
   - Note the public domain (e.g., `backend-production-xxxx.up.railway.app`)

6. The service will automatically deploy once configured

### Step 5: Deploy Frontend

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your repository again
3. **CRITICAL**: Configure the Root Directory:
   - Click on the newly created service
   - Go to "Settings" tab
   - Scroll to "Service Settings"
   - Set **Root Directory** to `frontend`
   - Railway will automatically detect the Node.js app and use nixpacks.toml

4. Go to "Variables" tab and add (use your actual backend URL from Step 4):
   - `VITE_API_URL` - Your backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)
   - `VITE_WS_URL` - Your backend WebSocket URL (e.g., `wss://backend-production-xxxx.up.railway.app`)
   - **Important**: Use `https://` for API URL and `wss://` (not `ws://`) for WebSocket URL

5. Go to "Settings" tab:
   - Under "Networking", click "Generate Domain" to enable public access
   - Note the public domain (e.g., `frontend-production-yyyy.up.railway.app`)

6. The service will automatically build and deploy

### Step 6: Verify Deployment

1. Open your frontend URL in a browser
2. Click "Create New Room"
3. Open the same room in another browser/device
4. Draw and verify real-time collaboration works
5. Refresh the page and verify strokes persist

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string (automatically set by Railway)
- `PORT` - Server port (automatically set by Railway)
- `NODE_ENV` - Set to `production` for Railway deployment

### Frontend
- `VITE_API_URL` - Backend API URL (e.g., `https://backend-production-xxxx.up.railway.app`)
- `VITE_WS_URL` - Backend WebSocket URL (e.g., `wss://backend-production-xxxx.up.railway.app`)

## API Documentation

### REST Endpoints

#### Create Room
```
POST /rooms
Response: { "roomId": "uuid" }
```

#### Get Room Strokes
```
GET /rooms/:roomId/strokes
Response: { "strokes": [...] }
```

### WebSocket Protocol

#### Join Room
```json
{
  "type": "join",
  "roomId": "uuid"
}
```

#### Send Stroke
```json
{
  "type": "stroke",
  "data": {
    "roomId": "uuid",
    "x": 100,
    "y": 150,
    "prevX": 95,
    "prevY": 145,
    "color": "#000000",
    "strokeWidth": 3
  }
}
```

#### Receive Stroke
```json
{
  "type": "stroke",
  "data": {
    "roomId": "uuid",
    "x": 100,
    "y": 150,
    "prevX": 95,
    "prevY": 145,
    "color": "#000000",
    "strokeWidth": 3
  }
}
```

## Database Schema

### Rooms Table
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Strokes Table
```sql
CREATE TABLE strokes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  prev_x FLOAT NOT NULL,
  prev_y FLOAT NOT NULL,
  color VARCHAR(20) NOT NULL,
  stroke_width INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE INDEX idx_strokes_room_id ON strokes(room_id);
```

## Troubleshooting

### Railway Build Errors

#### "Script start.sh not found" or "Could not determine how to build"
This error occurs when Railway cannot find the correct build configuration. **This is a monorepo**, so you must:

1. **Set the Root Directory** for each service:
   - Click on the service in Railway
   - Go to "Settings" tab
   - Find "Service Settings" section
   - Set "Root Directory" to either `backend` or `frontend`
   - Click "Save" and redeploy

2. Verify the `nixpacks.toml` file exists in the service directory
3. Check that `package.json` exists in the root directory you specified
4. If the build still fails, check Railway build logs for specific errors

**Important**: Each Railway service should have its Root Directory configured to point to either `backend` or `frontend`, not the repository root.

### WebSocket Connection Issues
- Ensure VITE_WS_URL uses `wss://` (not `ws://`) for production
- Verify CORS is properly configured in the backend
- Check Railway logs for connection errors

### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check PostgreSQL service is running in Railway
- Ensure migrations have been run

### Canvas Not Loading
- Check browser console for errors
- Verify API_URL is accessible
- Ensure room exists in database

## License

MIT

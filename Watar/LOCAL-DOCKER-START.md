# 🐳 Start Docker Locally - Quick Guide

## ✅ Prerequisites (You already have these!)
- ✅ Docker installed (version 29.2.1)
- ✅ Docker Compose installed (version 5.0.2)

## 🚀 Start Your Application

### Step 1: Create .env file (First time only)
```powershell
# Copy the example file
Copy-Item .env.example .env
```

Then edit `.env` file and update if needed (optional for local testing).

### Step 2: Build and Start
```powershell
# Build and start in detached mode (background)
docker-compose up -d
```

### Step 3: Access Your Application
Open your browser and go to:
- **URL:** http://localhost:3000
- **Login:** admin / admin123

## 📊 Useful Commands

### Check if running
```powershell
docker-compose ps
```

### View logs (real-time)
```powershell
docker-compose logs -f
```

### View last 50 log lines
```powershell
docker-compose logs --tail=50
```

### Stop the application
```powershell
docker-compose down
```

### Restart the application
```powershell
docker-compose restart
```

### Rebuild after code changes
```powershell
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Access container shell (for debugging)
```powershell
docker exec -it wattar-academy sh
```

### Check container stats (CPU, Memory)
```powershell
docker stats wattar-academy
```

## 🔧 Troubleshooting

### Port 3000 already in use
If you get an error about port 3000:

**Option 1: Stop the existing Node.js process**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

**Option 2: Use a different port**
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 3000 to 8080
```
Then access at: http://localhost:8080

### Container won't start
```powershell
# Check logs for errors
docker-compose logs wattar-academy

# Try rebuilding
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database issues
```powershell
# Make sure wattar.db exists in your directory
ls wattar.db

# If missing, you need to create it or copy from backup
```

### Docker daemon not running
If you get "Cannot connect to Docker daemon":
1. Open Docker Desktop application
2. Wait for it to start (whale icon in system tray)
3. Try the command again

## 🎯 Quick Start (Copy-Paste)

```powershell
# First time setup
Copy-Item .env.example .env

# Start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Open browser to http://localhost:3000
```

## 🛑 Stop Everything

```powershell
# Stop and remove containers
docker-compose down

# Stop, remove containers, and remove volumes
docker-compose down -v
```

## 📝 Notes

- Database file `wattar.db` is mounted from your local directory
- Any changes to the database persist even after stopping Docker
- Code changes require rebuilding the image
- For development, you might want to mount the code directory for live reload

## 🔄 Development Mode (Optional)

If you want to make code changes without rebuilding:

Create `docker-compose.dev.yml`:
```yaml
version: '3.8'

services:
  wattar-academy:
    build: .
    container_name: wattar-academy-dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - ./:/app
      - /app/node_modules
      - ./wattar.db:/app/wattar.db
    command: npm run dev
```

Then start with:
```powershell
docker-compose -f docker-compose.dev.yml up
```

This will reload automatically when you change code!

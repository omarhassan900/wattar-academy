# Deployment Guide

## Architecture

```
┌─────────────────────────────────────────┐
│              AWS EC2 Instance            │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Docker Container              │  │
│  │     (wattar-academy)              │  │
│  │                                   │  │
│  │  Node.js 18 (Alpine)             │  │
│  │  Express Server (:3000)          │  │
│  │                                   │  │
│  │  ┌─────────────────────────┐     │  │
│  │  │  server.js (all logic)  │     │  │
│  │  │  views/*.ejs            │     │  │
│  │  └─────────────────────────┘     │  │
│  │                                   │  │
│  └──────────┬────────────────────────┘  │
│             │ volume mount               │
│  ┌──────────▼────────────────────────┐  │
│  │  wattar.db (SQLite on host)       │  │
│  │  ./data/ directory                │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
         │
         │ Port 3000
         ▼
    Internet / Browser
```

## Docker Setup

### Dockerfile
- Base: `node:18-alpine`
- Runs as non-root user (`node`)
- Health check: HTTP GET to `/login` every 30s
- Exposes port 3000

### docker-compose.yml
```yaml
services:
  wattar-academy:
    build: .
    container_name: wattar-academy
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
    volumes:
      - ./data:/app/data        # Data directory
      - ./wattar.db:/app/wattar.db  # Database persistence
    healthcheck: ...
```

Key points:
- Database is mounted from host → persists across container restarts
- `restart: unless-stopped` → auto-restart on crash
- Single container, single network

## Update Workflow (GitHub → AWS)

### On Local Machine:
```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "description of changes"
git push origin main
```

### On AWS Server:
```bash
# 1. SSH in
ssh ec2-user@YOUR-AWS-IP

# 2. Pull changes
cd ~/wattar
git pull origin main

# 3. Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or for code-only changes (no new dependencies):
docker-compose restart
```

### When to rebuild vs restart:
- **Restart only** (`docker-compose restart`): Changed `.ejs` files, changed `server.js` logic
- **Rebuild** (`docker-compose up -d --build`): Changed `package.json`, changed `Dockerfile`

## Quick Docker Commands

```bash
# Check status
docker ps | grep wattar

# View logs
docker logs wattar-academy --tail 50

# Follow logs live
docker logs -f wattar-academy

# Access container shell
docker exec -it wattar-academy sh

# Copy file to container
docker cp myfile.js wattar-academy:/app/

# Copy file from container
docker cp wattar-academy:/app/wattar.db ./backup.db

# Restart
docker-compose restart

# Full rebuild
docker-compose down && docker-compose up -d --build
```

## Database Backup

```bash
# From host (database is volume-mounted)
cp wattar.db wattar-backup-$(date +%Y%m%d).db

# From inside container
docker cp wattar-academy:/app/wattar.db ./backup.db
```

## Environment Variables

Create `.env` file in project root:
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-random-secret-string-here
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Container won't start | `docker logs wattar-academy` to check errors |
| Database locked | `docker-compose restart` |
| Port already in use | `docker ps` to find conflicting container |
| Changes not showing | Rebuild: `docker-compose up -d --build` |
| Can't connect | Check security group allows port 3000 |
| npm install fails | Delete `node_modules`, rebuild image |

# Docker Deployment Guide for Wattar Academy

## 🐳 Quick Start with Docker

### Prerequisites
- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

### Local Development

1. **Build and run with Docker Compose:**
```bash
docker-compose up -d
```

2. **Access the application:**
- Open browser: http://localhost:3000
- Login: admin / admin123

3. **View logs:**
```bash
docker-compose logs -f
```

4. **Stop the application:**
```bash
docker-compose down
```

---

## 🚀 AWS Deployment Options

### Option 1: AWS ECS (Elastic Container Service) - Recommended

#### Step 1: Install AWS CLI
```bash
# Windows (PowerShell as Administrator)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

#### Step 2: Configure AWS CLI
```bash
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format: json
```

#### Step 3: Create ECR Repository
```bash
# Create repository
aws ecr create-repository --repository-name wattar-academy --region us-east-1

# Get login command
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com
```

#### Step 4: Build and Push Docker Image
```bash
# Build image
docker build -t wattar-academy .

# Tag image
docker tag wattar-academy:latest YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/wattar-academy:latest

# Push to ECR
docker push YOUR-ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/wattar-academy:latest
```

#### Step 5: Deploy to ECS

**Using AWS Console:**
1. Go to ECS in AWS Console
2. Create new cluster (Fargate)
3. Create task definition:
   - Container name: wattar-academy
   - Image: YOUR-ECR-IMAGE-URL
   - Port: 3000
   - Memory: 512 MB
   - CPU: 0.25 vCPU
4. Create service
5. Configure load balancer (optional)

**Estimated Cost:** $15-30/month

---

### Option 2: AWS Lightsail with Docker

#### Step 1: Create Lightsail Instance
1. Go to AWS Lightsail
2. Create instance with "Ubuntu 20.04"
3. Choose $10/month plan (2GB RAM recommended for Docker)
4. Open ports: 80, 443, 3000

#### Step 2: Connect and Install Docker
```bash
# Connect via SSH
ssh ubuntu@YOUR-LIGHTSAIL-IP

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

#### Step 3: Upload Application
```bash
# On your local machine
scp -i your-key.pem -r . ubuntu@YOUR-LIGHTSAIL-IP:/home/ubuntu/wattar-academy/
```

#### Step 4: Deploy
```bash
# On Lightsail instance
cd /home/ubuntu/wattar-academy

# Create .env file
cp .env.example .env
nano .env  # Edit with your settings

# Start application
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

**Estimated Cost:** $10/month

---

### Option 3: AWS App Runner (Easiest)

#### Step 1: Push to ECR (same as ECS steps 3-4)

#### Step 2: Create App Runner Service
1. Go to AWS App Runner
2. Click "Create service"
3. Choose "Container registry" → "Amazon ECR"
4. Select your image
5. Configure:
   - Port: 3000
   - CPU: 1 vCPU
   - Memory: 2 GB
6. Add environment variables
7. Create service

**Estimated Cost:** $25-40/month

---

## 🔧 Production Configuration

### 1. Update server.js for Docker

Add environment variable support at the top of server.js:

```javascript
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || 'wattar.db';
const SESSION_SECRET = process.env.SESSION_SECRET || 'wattar-academy-secret-key';

// Update database connection
const db = new sqlite3.Database(DB_PATH);

// Update session configuration
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
```

### 2. Create Production .env File
```bash
cp .env.example .env
nano .env
```

Update with secure values:
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=generate-random-32-character-string-here
DB_PATH=/app/wattar.db
```

### 3. Database Persistence

The docker-compose.yml already mounts the database as a volume:
```yaml
volumes:
  - ./wattar.db:/app/wattar.db
```

This ensures your data persists even if the container restarts.

---

## 🔒 Security Best Practices

### 1. Use Secrets Manager (AWS)
```bash
# Store session secret
aws secretsmanager create-secret \
    --name wattar-academy/session-secret \
    --secret-string "your-random-secret"

# Update ECS task to use secrets
```

### 2. Enable HTTPS with Nginx Reverse Proxy

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://wattar-academy:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Update `docker-compose.yml` to add Nginx:
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - wattar-academy
    networks:
      - wattar-network
```

### 3. Regular Backups

Create backup script `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec wattar-academy cp /app/wattar.db /app/data/backup_$DATE.db
aws s3 cp ./data/backup_$DATE.db s3://your-backup-bucket/
find ./data -name "backup_*.db" -mtime +7 -delete
```

Schedule with cron:
```bash
0 2 * * * /home/ubuntu/wattar-academy/backup.sh
```

---

## 📊 Monitoring

### Docker Stats
```bash
docker stats wattar-academy
```

### Application Logs
```bash
docker-compose logs -f --tail=100
```

### Health Check
```bash
docker inspect --format='{{.State.Health.Status}}' wattar-academy
```

---

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Or with zero downtime
docker-compose up -d --build
```

### Database Backup Before Update
```bash
docker exec wattar-academy cp /app/wattar.db /app/data/backup_before_update.db
```

### Rollback
```bash
docker-compose down
docker-compose up -d wattar-academy:previous-tag
```

---

## 🆘 Troubleshooting

### Container won't start
```bash
docker-compose logs wattar-academy
docker inspect wattar-academy
```

### Database locked
```bash
docker-compose restart wattar-academy
```

### Out of memory
```bash
# Increase memory in docker-compose.yml
services:
  wattar-academy:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "8080:3000"
```

---

## 📋 Deployment Checklist

- [ ] Build Docker image locally and test
- [ ] Create .env file with production values
- [ ] Change default admin password
- [ ] Set up database backups
- [ ] Configure HTTPS/SSL
- [ ] Set up monitoring
- [ ] Test health checks
- [ ] Document access credentials
- [ ] Set up automated backups to S3
- [ ] Configure CloudWatch logs (if using ECS)

---

## 💰 Cost Comparison

| Option | Monthly Cost | Complexity | Best For |
|--------|-------------|------------|----------|
| Lightsail + Docker | $10-20 | Medium | Small deployments |
| ECS Fargate | $15-30 | Medium | Scalable apps |
| App Runner | $25-40 | Low | Managed solution |
| EC2 + Docker | $10-50 | High | Full control |

---

## 🎉 Success!

Your Dockerized Wattar Academy is ready for AWS deployment!

**Next Steps:**
1. Choose deployment option (Lightsail recommended for start)
2. Follow the specific deployment steps
3. Configure domain and SSL
4. Set up backups
5. Monitor and maintain

---

## 📞 Quick Commands Reference

```bash
# Build
docker build -t wattar-academy .

# Run locally
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart

# Shell access
docker exec -it wattar-academy sh

# Database backup
docker exec wattar-academy cp /app/wattar.db /app/data/backup.db
```

---

**Deployment Time:** 1-2 hours  
**Difficulty:** Medium ⭐⭐⭐☆☆

Good luck with your Docker deployment! 🐳🚀

# AWS Docker Student Data Update Guide

## Overview
This guide is for updating student data when your Wattar Academy is running in Docker on AWS.

## Docker Setup
Your app runs in a Docker container with:
- Container name: `wattar-academy`
- Database mounted at: `./wattar.db` → `/app/wattar.db`
- Port: 3000

## Two Methods to Update

### Method 1: Run Script Inside Docker Container (Recommended)
This method runs the update script inside your existing Docker container.

### Method 2: Run Script on Host, Update Mounted Database
This method runs the script on the AWS host machine.

---

## Method 1: Inside Docker Container (Recommended)

### Step 1: Upload Files to AWS
```bash
# From your local machine
scp "Contact Information (Responses).xlsx" ec2-user@YOUR-AWS-IP:~/wattar/
scp update-students-aws.js ec2-user@YOUR-AWS-IP:~/wattar/
```

### Step 2: SSH to AWS
```bash
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar  # or wherever your docker-compose.yml is
```

### Step 3: Copy Files into Container
```bash
# Copy Excel file into container
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/

# Copy update script into container
docker cp update-students-aws.js wattar-academy:/app/
```

### Step 4: Run Update Inside Container
```bash
# Execute the update script inside the container
docker exec wattar-academy node update-students-aws.js --aws
```

### Step 5: Verify the Update
```bash
# Check the results
docker exec wattar-academy node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');
db.get('SELECT COUNT(*) as count FROM students WHERE status=\"active\"', (err, row) => {
  console.log('Active students:', row.count);
  db.close();
});
"
```

### Step 6: Copy Backup Out (Optional)
```bash
# List backup files
docker exec wattar-academy ls -la backup_students_*.json

# Copy backup to host for safekeeping
docker cp wattar-academy:/app/backup_students_TIMESTAMP.json ./
```

---

## Method 2: On Host Machine

### Step 1: Upload Files to AWS
```bash
# From your local machine
scp "Contact Information (Responses).xlsx" ec2-user@YOUR-AWS-IP:~/wattar/
scp update-students-aws.js ec2-user@YOUR-AWS-IP:~/wattar/
```

### Step 2: SSH to AWS
```bash
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar
```

### Step 3: Install Dependencies on Host
```bash
# Install Node.js if not already installed
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install required packages
npm install sqlite3 xlsx
```

### Step 4: Stop Container (Optional but Recommended)
```bash
docker-compose stop
```

### Step 5: Run Update Script
```bash
# The script will update the mounted wattar.db file
node update-students-aws.js --aws
```

### Step 6: Restart Container
```bash
docker-compose up -d
```

---

## Quick Docker Commands Reference

```bash
# Check if container is running
docker ps | grep wattar-academy

# View container logs
docker logs wattar-academy

# Stop container
docker-compose stop

# Start container
docker-compose up -d

# Restart container
docker-compose restart

# Execute command in container
docker exec wattar-academy <command>

# Copy file to container
docker cp <local-file> wattar-academy:/app/

# Copy file from container
docker cp wattar-academy:/app/<file> ./

# Access container shell
docker exec -it wattar-academy sh
```

---

## Complete Update Script (Docker Version)

Save this as `update-docker.sh` on your AWS server:

```bash
#!/bin/bash

echo "=== Wattar Academy Docker Update ==="
echo ""

# Check if files exist
if [ ! -f "Contact Information (Responses).xlsx" ]; then
    echo "❌ Excel file not found!"
    exit 1
fi

if [ ! -f "update-students-aws.js" ]; then
    echo "❌ Update script not found!"
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q wattar-academy; then
    echo "❌ Container is not running!"
    echo "Start it with: docker-compose up -d"
    exit 1
fi

echo "📋 Copying files to container..."
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
docker cp update-students-aws.js wattar-academy:/app/

echo ""
echo "🔄 Running update inside container..."
docker exec wattar-academy node update-students-aws.js --aws

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Update completed successfully!"
    
    # Get backup filename
    BACKUP=$(docker exec wattar-academy ls -t backup_students_*.json 2>/dev/null | head -1)
    
    if [ ! -z "$BACKUP" ]; then
        echo ""
        echo "💾 Copying backup to host..."
        docker cp wattar-academy:/app/$BACKUP ./
        echo "Backup saved: $BACKUP"
    fi
    
    echo ""
    echo "📊 Current student count:"
    docker exec wattar-academy node -e "const db=require('sqlite3').verbose().Database('wattar.db');new db.get('SELECT COUNT(*) as c FROM students WHERE status=\"active\"',(e,r)=>{console.log('Active students:',r.c);process.exit()});"
    
else
    echo ""
    echo "❌ Update failed!"
fi

echo ""
echo "✅ Done! Check your web interface to verify."
```

---

## Troubleshooting

### Issue: "Cannot find module 'xlsx'"
The container should already have all dependencies. If not:
```bash
docker exec wattar-academy npm install xlsx
```

### Issue: "Database is locked"
The container is using the database. Either:
- Stop the container first: `docker-compose stop`
- Or the script will retry automatically

### Issue: "Container not found"
Check container name:
```bash
docker ps -a
# Use the actual container name in commands
```

### Issue: "Permission denied"
Run with sudo:
```bash
sudo docker exec wattar-academy node update-students-aws.js --aws
```

---

## Verification Steps

After update, verify:

1. **Check container is running:**
   ```bash
   docker ps | grep wattar-academy
   ```

2. **Check logs for errors:**
   ```bash
   docker logs wattar-academy --tail 50
   ```

3. **Verify student count:**
   ```bash
   docker exec wattar-academy node -e "const db=require('sqlite3').verbose().Database('wattar.db');new db.get('SELECT COUNT(*) as c FROM students',(e,r)=>{console.log(r.c);process.exit()});"
   ```

4. **Test web interface:**
   - Open http://YOUR-AWS-IP:3000
   - Login and check Students page

---

## Rollback Procedure

If something goes wrong:

```bash
# Stop container
docker-compose stop

# Restore from backup (on host)
cp backup_students_TIMESTAMP.json restore.json

# Use sqlite3 to restore
docker run --rm -v $(pwd):/backup -v $(pwd)/wattar.db:/db \
  alpine/sqlite:latest sh -c "
  sqlite3 /db 'DELETE FROM students';
  # Manual restore needed - contact support
"

# Or restore entire database from your backup
cp wattar.db.backup wattar.db

# Restart
docker-compose up -d
```

---

## Important Notes

1. ✅ **Database is mounted** - Changes persist even if container restarts
2. ✅ **No need to rebuild** - Just run the script inside container
3. ✅ **Backups are automatic** - But copy them to host for safety
4. ✅ **Zero downtime option** - Run script while container is running
5. ⚠️ **Test locally first** - Always test with local Docker first

---

## Quick Start Summary

```bash
# 1. Upload files
scp files... ec2-user@AWS-IP:~/wattar/

# 2. SSH to AWS
ssh ec2-user@AWS-IP
cd ~/wattar

# 3. Copy to container
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
docker cp update-students-aws.js wattar-academy:/app/

# 4. Run update
docker exec wattar-academy node update-students-aws.js --aws

# 5. Verify
docker logs wattar-academy --tail 20
```

---

**Last Updated:** March 8, 2026
**For:** Docker deployment on AWS

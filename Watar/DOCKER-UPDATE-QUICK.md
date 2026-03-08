# Docker Update - Quick Reference

## 🚀 Fastest Way (3 Commands)

```bash
# 1. Upload files (from your local machine)
scp "Contact Information (Responses).xlsx" update-students-aws.js update-docker.sh ec2-user@YOUR-AWS-IP:~/wattar/

# 2. SSH and run (on AWS)
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar && chmod +x update-docker.sh && ./update-docker.sh

# 3. Done! ✅
```

---

## 📋 Manual Method (Step by Step)

### On Your Local Machine:
```bash
# Test first
node update-students-aws.js

# Upload to AWS
scp "Contact Information (Responses).xlsx" ec2-user@YOUR-AWS-IP:~/wattar/
scp update-students-aws.js ec2-user@YOUR-AWS-IP:~/wattar/
```

### On AWS Server:
```bash
# SSH to server
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar

# Copy files to Docker container
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
docker cp update-students-aws.js wattar-academy:/app/

# Run update inside container
docker exec wattar-academy node update-students-aws.js --aws

# Copy backup out (optional)
docker cp wattar-academy:/app/backup_students_*.json ./
```

---

## 🔍 Verification

```bash
# Check student count
docker exec wattar-academy node -e "const db=require('sqlite3').verbose().Database('wattar.db');new db.get('SELECT COUNT(*) as c FROM students WHERE status=\"active\"',(e,r)=>{console.log('Active:',r.c);process.exit()});"

# Check container logs
docker logs wattar-academy --tail 50

# Check container is running
docker ps | grep wattar-academy
```

---

## 🛠️ Useful Docker Commands

```bash
# View logs
docker logs wattar-academy

# Restart container
docker-compose restart

# Stop container
docker-compose stop

# Start container
docker-compose up -d

# Access container shell
docker exec -it wattar-academy sh

# Copy file to container
docker cp <file> wattar-academy:/app/

# Copy file from container
docker cp wattar-academy:/app/<file> ./
```

---

## ⚠️ Troubleshooting

**Container not running?**
```bash
docker-compose up -d
```

**Can't find xlsx module?**
```bash
docker exec wattar-academy npm install xlsx
```

**Database locked?**
```bash
docker-compose restart
# Then try again
```

**Permission denied?**
```bash
sudo docker exec wattar-academy node update-students-aws.js --aws
```

---

## 📊 What Gets Updated

- ✅ 23 students from Excel file
- ✅ Auto-assigns trainers by instrument
- ✅ Updates existing students (by phone)
- ✅ Adds new students
- ✅ Creates automatic backup
- ✅ Database persists (mounted volume)

---

## 🎯 Success Checklist

- [ ] Tested locally first
- [ ] Files uploaded to AWS
- [ ] Script ran without errors
- [ ] Backup file created
- [ ] Container still running
- [ ] Can access website
- [ ] New students visible
- [ ] Trainer assignments correct

---

## 📞 Quick Help

**Full guide:** AWS-DOCKER-UPDATE-GUIDE.md
**Summary:** STUDENT-UPDATE-SUMMARY.md
**Verify:** `docker exec wattar-academy node verify-update.js --aws`

---

**Status:** Ready for Docker deployment ✅
**Container:** wattar-academy
**Database:** Mounted at ./wattar.db

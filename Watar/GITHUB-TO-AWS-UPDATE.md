# GitHub to AWS Update Workflow

## Overview
This guide walks you through updating student data by pushing to GitHub first, then pulling on AWS.

---

## Step 1: Prepare Local Repository

### 1.1 Test the Update Locally
```bash
# Make sure the update script works
node update-students-aws.js
```

Expected output:
- ✅ Valid students: 23
- ✅ Updated: 2
- ✅ Inserted: 21
- ✅ Errors: 0

### 1.2 Check Git Status
```bash
git status
```

You should see:
- `Contact Information (Responses).xlsx` (new file)
- `update-students-aws.js` (new file)
- `update-docker.sh` (new file)
- Other helper files

### 1.3 Add Files to Git
```bash
# Add the Excel file
git add "Contact Information (Responses).xlsx"

# Add the update script
git add update-students-aws.js

# Add the Docker helper script
git add update-docker.sh

# Add documentation
git add AWS-DOCKER-UPDATE-GUIDE.md
git add DOCKER-UPDATE-QUICK.md
git add STUDENT-UPDATE-SUMMARY.md

# Optional: Add other helper files
git add verify-update.js
git add test-docker-local.sh
```

### 1.4 Commit Changes
```bash
git commit -m "Add student data update scripts and new student information"
```

### 1.5 Push to GitHub
```bash
git push origin main
# or: git push origin master
```

---

## Step 2: Update on AWS

### 2.1 SSH to AWS Server
```bash
ssh ec2-user@YOUR-AWS-IP
```

### 2.2 Navigate to Your App Directory
```bash
cd ~/wattar
# or wherever your app is located
```

### 2.3 Check Current Status
```bash
# Check which branch you're on
git branch

# Check if there are uncommitted changes
git status
```

### 2.4 Pull Latest Changes from GitHub
```bash
git pull origin main
# or: git pull origin master
```

You should see:
```
Updating xxxxx..yyyyy
Fast-forward
 Contact Information (Responses).xlsx | Bin 0 -> 8823 bytes
 update-students-aws.js                | 200 ++++++++++++++++++++
 update-docker.sh                      | 150 +++++++++++++++
 ...
```

### 2.5 Verify Files Are Present
```bash
ls -la "Contact Information (Responses).xlsx"
ls -la update-students-aws.js
ls -la update-docker.sh
```

---

## Step 3: Run the Update

### 3.1 Make Script Executable
```bash
chmod +x update-docker.sh
```

### 3.2 Run the Update Script
```bash
./update-docker.sh
```

The script will:
1. ✅ Check if container is running
2. ✅ Copy files to container
3. ✅ Install dependencies if needed
4. ✅ Run the update
5. ✅ Create backup
6. ✅ Copy backup to host
7. ✅ Verify results

### 3.3 Review the Output
Look for:
- ✅ "Update completed successfully!"
- ✅ Number of students updated/inserted
- ✅ Backup file created
- ✅ Active students count

---

## Step 4: Verify the Update

### 4.1 Check Container Status
```bash
docker ps | grep wattar-academy
```

Should show container is running.

### 4.2 Check Student Count
```bash
docker exec wattar-academy node -e "const db=require('sqlite3').verbose().Database('wattar.db');new db.get('SELECT COUNT(*) as c FROM students WHERE status=\"active\"',(e,r)=>{console.log('Active students:',r.c);process.exit()});"
```

Expected: ~111 students (91 + 21 new - 1 duplicate)

### 4.3 Check Web Interface
1. Open your browser
2. Go to: `http://YOUR-AWS-IP:3000` or your domain
3. Login as admin
4. Go to Students page
5. Verify new students appear
6. Check trainer assignments

---

## Step 5: Backup and Cleanup

### 5.1 Keep the Backup Safe
```bash
# List backup files
ls -la backup_students_*.json

# Optional: Copy to a safe location
cp backup_students_*.json ~/backups/
```

### 5.2 Optional: Clean Up Container
```bash
# Remove files from container (optional)
docker exec wattar-academy rm "Contact Information (Responses).xlsx"
docker exec wattar-academy rm update-students-aws.js
```

---

## Quick Command Reference

```bash
# === On Local Machine ===
git add "Contact Information (Responses).xlsx" update-students-aws.js update-docker.sh
git commit -m "Add student data update"
git push origin main

# === On AWS Server ===
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar
git pull origin main
chmod +x update-docker.sh
./update-docker.sh

# === Verify ===
docker ps
docker logs wattar-academy --tail 20
# Open website and check
```

---

## Troubleshooting

### Issue: Git pull fails with "uncommitted changes"
```bash
# Stash your changes
git stash

# Pull updates
git pull origin main

# Reapply your changes if needed
git stash pop
```

### Issue: Permission denied on update-docker.sh
```bash
chmod +x update-docker.sh
```

### Issue: Container not running
```bash
docker-compose up -d
```

### Issue: Can't push to GitHub (large file)
The Excel file is small (8KB), so this shouldn't be an issue. But if you have issues:
```bash
# Check file size
ls -lh "Contact Information (Responses).xlsx"

# If too large, use Git LFS or upload separately
```

---

## Alternative: Manual Docker Commands

If you prefer not to use the script:

```bash
# After git pull on AWS
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
docker cp update-students-aws.js wattar-academy:/app/
docker exec wattar-academy node update-students-aws.js --aws
docker cp wattar-academy:/app/backup_students_*.json ./
```

---

## Rollback Procedure

If something goes wrong:

```bash
# On AWS, restore from backup
docker-compose stop

# The backup file is on the host
ls backup_students_*.json

# You can restore manually or contact support
# Your data is safe in the backup file

docker-compose up -d
```

---

## Best Practices

1. ✅ **Always test locally first** before pushing to GitHub
2. ✅ **Commit with clear messages** describing what changed
3. ✅ **Keep backups** for at least 30 days
4. ✅ **Verify in web interface** after update
5. ✅ **Document any manual changes** needed

---

## Complete Workflow Summary

```
Local Machine:
1. Test update → 2. Git add → 3. Git commit → 4. Git push

AWS Server:
5. SSH → 6. Git pull → 7. Run update-docker.sh → 8. Verify

Done! ✅
```

---

**Advantages of This Workflow:**
- ✅ Version controlled (everything in Git)
- ✅ Easy to rollback (git revert)
- ✅ Reproducible (same process every time)
- ✅ Documented (commit messages)
- ✅ Safe (test locally first)

---

**Last Updated:** March 8, 2026
**Workflow:** GitHub → AWS Docker

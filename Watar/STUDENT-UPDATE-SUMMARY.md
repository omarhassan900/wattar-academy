# Student Data Update - Quick Summary

## What You Have

✅ **Excel File:** `Contact Information (Responses).xlsx` (23 students)
✅ **Update Script:** `update-students-aws.js` (tested and working)
✅ **Local Test:** Successful (2 updated, 21 inserted, 0 errors)
✅ **Docker Helper:** `update-docker.sh` (for AWS deployment)

## Current Status

- **Local Database:** 111 active students (after test)
- **AWS Database:** 91 active students (needs update)
- **New Students to Add:** 21
- **Students to Update:** 2
- **Deployment:** Docker on AWS

## Quick Start - Docker Version (3 Steps)

### 1. Test Locally (Already Done ✅)
```bash
node update-students-aws.js
```

### 2. Upload to AWS
Upload these 3 files to your AWS server:
- `Contact Information (Responses).xlsx`
- `update-students-aws.js`
- `update-docker.sh`

```bash
# From your local machine
scp "Contact Information (Responses).xlsx" ec2-user@YOUR-AWS-IP:~/wattar/
scp update-students-aws.js ec2-user@YOUR-AWS-IP:~/wattar/
scp update-docker.sh ec2-user@YOUR-AWS-IP:~/wattar/
```

### 3. Run on AWS (Inside Docker)
```bash
# SSH to AWS
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar

# Make script executable
chmod +x update-docker.sh

# Run the update
./update-docker.sh
```

## Alternative: Manual Docker Commands

```bash
# Copy files to container
docker cp "Contact Information (Responses).xlsx" wattar-academy:/app/
docker cp update-students-aws.js wattar-academy:/app/

# Run update inside container
docker exec wattar-academy node update-students-aws.js --aws

# Copy backup out
docker cp wattar-academy:/app/backup_students_*.json ./
```

## What the Script Does

1. ✅ Creates automatic backup
2. ✅ Reads Excel data
3. ✅ Matches students by phone number
4. ✅ Updates existing students
5. ✅ Adds new students
6. ✅ Auto-assigns trainers by instrument
7. ✅ Shows detailed report

## Trainer Assignment (Automatic)

- **Piano/Vocal** → Fady
- **Guitar** → Tema  
- **Violin** → Romario
- **Oud** → (needs manual assignment)

## Safety Features

- ✅ Automatic backup before changes
- ✅ Test mode (local) before production
- ✅ No data loss - updates preserve existing info
- ✅ Phone number matching prevents duplicates
- ✅ Rollback capability from backup

## Files Created

1. `update-students-aws.js` - Main update script
2. `AWS-STUDENT-UPDATE-GUIDE.md` - Detailed instructions
3. `update-aws-quick.bat` - Windows helper script
4. `update-aws-quick.sh` - Linux helper script (for AWS)
5. `backup_students_*.json` - Automatic backups

## Windows Quick Test

Just double-click: `update-aws-quick.bat`

## Need Help?

See the guides:
- **AWS-DOCKER-UPDATE-GUIDE.md** - Complete Docker instructions
- **AWS-STUDENT-UPDATE-GUIDE.md** - General update guide
- Troubleshooting, rollback procedures, and detailed steps

## Important Notes

⚠️ **Always test locally first** (you already did this ✅)
⚠️ **Keep backup files** for at least 30 days
⚠️ **Verify in web interface** after update
⚠️ **Stop the app** before updating (optional but recommended)

## Your Data Mapping

| Excel Column | Database Field | Notes |
|--------------|----------------|-------|
| Full Name | name | Required |
| Phone number | phone | Required (unique ID) |
| Parent Phone | parent_phone | Optional |
| Email | email | Optional |
| Address | address | Optional |
| Date of birth | date_of_birth | Auto-parsed |
| Instrument | instrument | Auto-assigns trainer |
| - | current_level | Auto: "Month 1" |
| - | start_date | Auto: Today |
| - | status | Auto: "active" |

## Success Checklist

After running on AWS, verify:
- [ ] Script completed without errors
- [ ] Backup file was created
- [ ] Can login to website
- [ ] New students appear in Students page
- [ ] Trainer assignments are correct
- [ ] Student details are accurate
- [ ] Total student count is correct

## Quick Commands Reference

```bash
# Test locally
node update-students-aws.js

# Update AWS (after SSH)
node update-students-aws.js --aws

# Check student count
node -e "const db=require('sqlite3').verbose().Database('wattar.db'); new db.get('SELECT COUNT(*) as c FROM students WHERE status=\"active\"',(e,r)=>{console.log(r.c);process.exit()});"

# View backup
cat backup_students_*.json | head -20
```

---

**Status:** Ready for AWS Deployment ✅
**Last Test:** March 8, 2026 - Successful
**Next Step:** Upload files to AWS and run with --aws flag

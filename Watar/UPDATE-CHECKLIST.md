# Student Update Checklist

Use this checklist to ensure you don't miss any steps.

---

## 📋 Pre-Update (Local Machine)

- [ ] Excel file is ready: `Contact Information (Responses).xlsx`
- [ ] Test update locally: `node update-students-aws.js`
- [ ] Review output: No errors, correct counts
- [ ] Backup created locally

---

## 📤 Push to GitHub (Local Machine)

```bash
git add "Contact Information (Responses).xlsx"
git add update-students-aws.js
git add update-docker.sh
git add *.md
git commit -m "Add student data update scripts"
git push origin main
```

- [ ] Files added to git
- [ ] Committed with clear message
- [ ] Pushed to GitHub successfully
- [ ] Verified on GitHub website (optional)

---

## 📥 Pull on AWS (AWS Server)

```bash
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar
git pull origin main
```

- [ ] SSH connected to AWS
- [ ] In correct directory
- [ ] Git pull successful
- [ ] Files present on server

---

## 🚀 Run Update (AWS Server)

```bash
chmod +x update-docker.sh
./update-docker.sh
```

- [ ] Script is executable
- [ ] Script ran without errors
- [ ] Backup file created
- [ ] Update summary shows correct numbers

---

## ✅ Verify (AWS Server & Browser)

```bash
docker ps | grep wattar-academy
docker logs wattar-academy --tail 20
```

- [ ] Container is running
- [ ] No errors in logs
- [ ] Can access website
- [ ] Login works
- [ ] New students visible in Students page
- [ ] Trainer assignments correct
- [ ] Student details accurate

---

## 💾 Backup (AWS Server)

```bash
ls -la backup_students_*.json
cp backup_students_*.json ~/backups/
```

- [ ] Backup file exists
- [ ] Backup copied to safe location
- [ ] Backup file size looks reasonable

---

## 📊 Final Check

- [ ] Total student count is correct (~111)
- [ ] All 23 new students are in system
- [ ] No duplicate students
- [ ] All required fields populated
- [ ] System is stable and responsive

---

## 🎉 Done!

Date completed: _______________
Time taken: _______________
Issues encountered: _______________
Notes: _______________

---

## 🆘 If Something Goes Wrong

1. Don't panic - backup exists
2. Check error messages
3. Review logs: `docker logs wattar-academy`
4. Container running? `docker ps`
5. Restart if needed: `docker-compose restart`
6. Restore from backup if necessary
7. See: AWS-DOCKER-UPDATE-GUIDE.md

---

## Quick Reference

**Test locally:**
```bash
node update-students-aws.js
```

**Push to GitHub:**
```bash
git add . && git commit -m "Update students" && git push
```

**Update on AWS:**
```bash
ssh ec2-user@AWS-IP
cd ~/wattar && git pull && ./update-docker.sh
```

**Verify:**
```bash
docker exec wattar-academy node -e "const db=require('sqlite3').verbose().Database('wattar.db');new db.get('SELECT COUNT(*) as c FROM students',(e,r)=>{console.log(r.c);process.exit()});"
```

---

**Keep this checklist for future updates!**

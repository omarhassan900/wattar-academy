# AWS Deployment - Quick Start Guide

## 🚀 Deploy in 7 Simple Steps (30 minutes)

### Step 1: Create AWS Account (5 min)
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Complete registration (need credit card)

### Step 2: Launch Lightsail Instance (3 min)
1. Login to AWS Console
2. Search "Lightsail" → Click it
3. Click "Create instance"
4. Choose: **Ubuntu 20.04 LTS**
5. Select plan: **$5/month** (1GB RAM)
6. Name it: **wattar-academy**
7. Click "Create instance"
8. Wait 2 minutes

### Step 3: Open Port 3000 (1 min)
1. Click your instance name
2. Go to "Networking" tab
3. Click "Add rule" under Firewall
4. **Protocol:** TCP
5. **Port:** 3000
6. Click "Create"

### Step 4: Connect & Install Node.js (5 min)
1. Click "Connect using SSH"
2. Copy and paste these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Verify
node --version
```

### Step 5: Upload Your Files (5 min)

**Easy Method - Manual Upload:**
1. In SSH terminal, create directory:
```bash
mkdir -p /home/ubuntu/wattar-academy
cd /home/ubuntu/wattar-academy
```

2. Use Lightsail file upload feature to upload:
   - server.js
   - package.json
   - wattar.db
   - views/ folder (zip it first, then unzip on server)

**Or use this command on your Windows computer:**
```powershell
# Download SSH key from Lightsail first
# Then run (replace YOUR-IP):
scp -i path\to\key.pem -r D:\Watar\* ubuntu@YOUR-IP:/home/ubuntu/wattar-academy/
```

### Step 6: Install & Start (5 min)
```bash
cd /home/ubuntu/wattar-academy

# Install dependencies
npm install

# Start application
pm2 start server.js --name wattar-academy

# Save configuration
pm2 save

# Enable auto-start
pm2 startup
# Run the command it shows

# Check status
pm2 status
```

### Step 7: Access Your App! (1 min)
1. Go to Lightsail console
2. Copy your instance's **Public IP**
3. Open browser: `http://YOUR-IP:3000`
4. Login with: admin / admin123

## ✅ Done! Your app is live on AWS!

---

## 🔒 Important: Secure Your App

After deployment, immediately:

```bash
cd /home/ubuntu/wattar-academy

# Change admin password
node -e "
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./wattar.db');
const newPass = bcrypt.hashSync('YOUR-NEW-PASSWORD', 10);
db.run('UPDATE users SET password_hash = ? WHERE username = ?', [newPass, 'admin']);
db.close();
"

# Restart app
pm2 restart wattar-academy
```

---

## 📊 Your AWS Costs

- **Lightsail Instance:** $5/month
- **Data Transfer:** Included (2TB)
- **Backups:** $1/month (optional)
- **Total:** ~$5-6/month

---

## 🆘 Troubleshooting

**Can't access the app?**
- Check firewall has port 3000 open
- Run: `pm2 logs wattar-academy`
- Try: `curl http://localhost:3000` on server

**App crashed?**
```bash
pm2 restart wattar-academy
pm2 logs wattar-academy
```

**Need to update app?**
```bash
cd /home/ubuntu/wattar-academy
# Upload new files
pm2 restart wattar-academy
```

---

## 📞 Need Help?

Read the full guide: **AWS-DEPLOYMENT-GUIDE.md**

---

**That's it! You're live on AWS! 🎉**

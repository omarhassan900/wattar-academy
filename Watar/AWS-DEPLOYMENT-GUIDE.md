# Wattar Academy - AWS Deployment Guide

## 🚀 Complete AWS Deployment Steps

This guide will walk you through deploying your Wattar Academy Management System on AWS.

---

## 📋 Prerequisites

- AWS Account (create at https://aws.amazon.com)
- Credit card for AWS billing
- Basic understanding of terminal/command line
- Your application files ready

---

## 🎯 Recommended AWS Deployment Option

### Option 1: AWS EC2 (Recommended for Full Control)
**Best for:** Production deployment with full control
**Cost:** ~$10-30/month
**Difficulty:** Medium

### Option 2: AWS Elastic Beanstalk (Easiest)
**Best for:** Quick deployment, managed infrastructure
**Cost:** ~$15-40/month
**Difficulty:** Easy

### Option 3: AWS Lightsail (Simplest & Cheapest)
**Best for:** Small to medium deployments
**Cost:** $3.50-10/month
**Difficulty:** Easy

---

## 🌟 RECOMMENDED: AWS Lightsail Deployment (Easiest & Cheapest)

### Step 1: Create AWS Account
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow the registration process
4. Add payment method (required)

### Step 2: Access AWS Lightsail
1. Login to AWS Console
2. Search for "Lightsail" in the services search bar
3. Click on "Amazon Lightsail"

### Step 3: Create Lightsail Instance
1. Click "Create instance"
2. **Select platform:** Linux/Unix
3. **Select blueprint:** OS Only → Ubuntu 20.04 LTS
4. **Choose instance plan:** 
   - $3.50/month (512 MB RAM, 1 vCPU) - For testing
   - $5/month (1 GB RAM, 1 vCPU) - Recommended for production
   - $10/month (2 GB RAM, 1 vCPU) - For better performance

5. **Name your instance:** wattar-academy
6. Click "Create instance"
7. Wait 2-3 minutes for instance to start

### Step 4: Configure Firewall
1. Click on your instance name
2. Go to "Networking" tab
3. Under "Firewall", add these rules:
   - **Application:** Custom
   - **Protocol:** TCP
   - **Port:** 3000
   - Click "Create"

### Step 5: Connect to Your Instance
1. Click on your instance
2. Click "Connect using SSH" (opens browser terminal)
3. You're now connected to your server!

### Step 6: Install Node.js
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 7: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Step 8: Upload Your Application

**Option A: Using SCP (From your local computer)**
```bash
# On your local computer (Windows PowerShell or Command Prompt)
# First, download your SSH key from Lightsail:
# 1. Go to Lightsail console
# 2. Click "Account" → "SSH keys"
# 3. Download your default key

# Then upload files (replace paths accordingly)
scp -i path/to/your-key.pem -r D:\Watar ubuntu@YOUR-INSTANCE-IP:/home/ubuntu/
```

**Option B: Using Git (Recommended)**
```bash
# On your Lightsail instance
cd /home/ubuntu

# Install git
sudo apt install git -y

# Option 1: If you have a GitHub repository
git clone https://github.com/yourusername/wattar-academy.git
cd wattar-academy

# Option 2: Create directory and upload files manually
mkdir wattar-academy
cd wattar-academy
```

**Option C: Manual Upload via Lightsail Console**
1. In Lightsail, click your instance
2. Use the file upload feature in the SSH terminal
3. Upload your files one by one (or create a zip first)

### Step 9: Prepare Application Files

If uploading manually, create these files on the server:

```bash
# Create application directory
mkdir -p /home/ubuntu/wattar-academy
cd /home/ubuntu/wattar-academy

# You'll need to upload these files:
# - server.js
# - package.json
# - wattar.db
# - views/ folder (all .ejs files)
# - public/ folder (if any)
```

### Step 10: Install Dependencies
```bash
cd /home/ubuntu/wattar-academy
npm install
```

### Step 11: Configure Application for Production

Edit server.js to use environment variables:
```bash
nano server.js
```

Update the port configuration (around line 1700):
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wattar Academy Management System running on port ${PORT}`);
});
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 12: Start Application with PM2
```bash
# Start the application
pm2 start server.js --name wattar-academy

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Copy and run the command that PM2 outputs

# Check status
pm2 status
pm2 logs wattar-academy
```

### Step 13: Access Your Application
1. Go back to Lightsail console
2. Find your instance's **Public IP address**
3. Open browser and go to: `http://YOUR-IP-ADDRESS:3000`
4. You should see your login page!

### Step 14: Set Up Domain Name (Optional)

**Option A: Use Lightsail Static IP**
1. In Lightsail, go to "Networking" tab
2. Click "Create static IP"
3. Attach it to your instance
4. Use this IP to access your application

**Option B: Use Custom Domain**
1. Buy a domain (from Namecheap, GoDaddy, etc.)
2. In Lightsail, go to "Networking" → "DNS zones"
3. Create DNS zone for your domain
4. Add A record pointing to your static IP
5. Update nameservers at your domain registrar

### Step 15: Set Up SSL/HTTPS (Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/wattar-academy
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/wattar-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 💰 Cost Breakdown

### Lightsail Pricing
- **$3.50/month:** 512 MB RAM, 20 GB SSD, 1 TB transfer
- **$5/month:** 1 GB RAM, 40 GB SSD, 2 TB transfer (Recommended)
- **$10/month:** 2 GB RAM, 60 GB SSD, 3 TB transfer

### Additional Costs
- Domain name: $10-15/year (optional)
- Backups: $1-2/month (recommended)
- Static IP: Free with Lightsail

**Total Estimated Cost: $5-10/month**

---

## 🔒 Security Best Practices

### 1. Change Default Passwords
```bash
# On your server
cd /home/ubuntu/wattar-academy
node -e "
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./wattar.db');
const newPassword = bcrypt.hashSync('YOUR-NEW-SECURE-PASSWORD', 10);
db.run('UPDATE users SET password_hash = ? WHERE username = ?', [newPassword, 'admin'], (err) => {
    if (err) console.error(err);
    else console.log('Password updated!');
    db.close();
});
"
```

### 2. Update Session Secret
```bash
nano server.js
```
Find and update:
```javascript
app.use(session({
    secret: 'CHANGE-TO-RANDOM-STRING-HERE', // Generate random string
    resave: false,
    saveUninitialized: false
}));
```

### 3. Set Up Firewall
```bash
# Enable UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 4. Set Up Automated Backups

Create backup script:
```bash
nano /home/ubuntu/backup-db.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /home/ubuntu/wattar-academy/wattar.db /home/ubuntu/backups/wattar_$DATE.db
# Keep only last 7 days of backups
find /home/ubuntu/backups -name "wattar_*.db" -mtime +7 -delete
```

```bash
# Make executable
chmod +x /home/ubuntu/backup-db.sh

# Create backups directory
mkdir -p /home/ubuntu/backups

# Add to crontab (daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /home/ubuntu/backup-db.sh
```

---

## 🔧 Maintenance Commands

### Check Application Status
```bash
pm2 status
pm2 logs wattar-academy
pm2 monit
```

### Restart Application
```bash
pm2 restart wattar-academy
```

### Update Application
```bash
cd /home/ubuntu/wattar-academy
# Upload new files or pull from git
git pull origin main
npm install
pm2 restart wattar-academy
```

### View Logs
```bash
pm2 logs wattar-academy --lines 100
```

### Database Backup
```bash
cp wattar.db wattar_backup_$(date +%Y%m%d).db
```

---

## 📊 Monitoring & Alerts

### Set Up CloudWatch (Optional)
1. Go to AWS CloudWatch
2. Create alarm for:
   - CPU usage > 80%
   - Memory usage > 80%
   - Disk usage > 80%

### Set Up Email Alerts
```bash
# Install monitoring tool
npm install -g pm2-logrotate
pm2 install pm2-logrotate
```

---

## 🆘 Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs wattar-academy

# Check if port is in use
sudo netstat -tulpn | grep 3000

# Restart PM2
pm2 restart wattar-academy
```

### Can't Access from Browser
1. Check firewall rules in Lightsail
2. Verify application is running: `pm2 status`
3. Check if port 3000 is open: `sudo netstat -tulpn | grep 3000`
4. Try accessing: `http://YOUR-IP:3000`

### Database Errors
```bash
# Check database file exists
ls -la wattar.db

# Check permissions
chmod 644 wattar.db

# Restore from backup
cp /home/ubuntu/backups/wattar_YYYYMMDD.db wattar.db
pm2 restart wattar-academy
```

---

## 📝 Quick Deployment Checklist

- [ ] Create AWS Lightsail instance
- [ ] Configure firewall (port 3000)
- [ ] Install Node.js and PM2
- [ ] Upload application files
- [ ] Install dependencies (`npm install`)
- [ ] Update server.js for production
- [ ] Change default passwords
- [ ] Update session secret
- [ ] Start with PM2
- [ ] Test application access
- [ ] Set up automated backups
- [ ] Configure domain (optional)
- [ ] Set up SSL (optional)
- [ ] Monitor and maintain

---

## 🎉 Success!

Your Wattar Academy Management System is now live on AWS!

**Access your application at:**
- `http://YOUR-LIGHTSAIL-IP:3000`
- Or `https://your-domain.com` (if configured)

**Default login:**
- Username: admin
- Password: (change immediately!)

---

## 📞 Support Resources

- AWS Lightsail Documentation: https://lightsail.aws.amazon.com/ls/docs
- PM2 Documentation: https://pm2.keymetrics.io/docs
- Node.js Documentation: https://nodejs.org/docs

---

**Deployment Time: 30-60 minutes**  
**Monthly Cost: $5-10**  
**Difficulty: Easy** ⭐⭐☆☆☆

Good luck with your deployment! 🚀

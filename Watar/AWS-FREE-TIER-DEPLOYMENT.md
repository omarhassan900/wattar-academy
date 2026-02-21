# 🆓 Deploy Wattar Academy on AWS - FREE TIER

## ✅ Free Deployment Options

### Option 1: AWS EC2 Free Tier (RECOMMENDED - 100% FREE for 12 months)

**What you get FREE:**
- 750 hours/month of t2.micro instance (enough to run 24/7)
- 30 GB of EBS storage
- 15 GB of bandwidth out
- Valid for 12 months from AWS account creation

**Perfect for your app!** ✨

---

## 🚀 Step-by-Step Free Deployment

### Step 1: Create AWS Account (5 min)
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Complete registration
4. **Important:** You need a credit card, but won't be charged if you stay within free tier limits
5. Verify your account

### Step 2: Launch Free EC2 Instance (5 min)

1. **Login to AWS Console**
2. **Search for "EC2"** and click it
3. **Click "Launch Instance"**

4. **Configure Instance:**
   - **Name:** wattar-academy
   - **Application and OS Images:** 
     - Click "Quick Start"
     - Select **Ubuntu Server 22.04 LTS**
     - Make sure it says "Free tier eligible" ✅
   
   - **Instance type:** 
     - Select **t2.micro** (Free tier eligible) ✅
     - 1 vCPU, 1 GB RAM
   
   - **Key pair:**
     - Click "Create new key pair"
     - Name: wattar-academy-key
     - Type: RSA
     - Format: .pem (for SSH) or .ppk (for PuTTY on Windows)
     - Click "Create key pair"
     - **SAVE THIS FILE!** You'll need it to connect
   
   - **Network settings:**
     - Click "Edit"
     - Allow SSH traffic from: Anywhere (0.0.0.0/0)
     - Click "Add security group rule"
       - Type: Custom TCP
       - Port: 3000
       - Source: Anywhere (0.0.0.0/0)
     - Click "Add security group rule" again
       - Type: HTTP
       - Port: 80
       - Source: Anywhere (0.0.0.0/0)
   
   - **Configure storage:**
     - 8 GB (default) - Free tier includes up to 30 GB
     - You can increase to 20 GB if needed (still free)
   
5. **Click "Launch instance"**
6. Wait 2-3 minutes for instance to start

### Step 3: Connect to Your Instance (3 min)

**Option A: Using EC2 Instance Connect (Easiest - Browser-based)**
1. Go to EC2 Dashboard
2. Click on your instance
3. Click "Connect" button at top
4. Choose "EC2 Instance Connect"
5. Click "Connect" - Opens terminal in browser!

**Option B: Using SSH (Windows PowerShell)**
```powershell
# Navigate to where you saved your key
cd Downloads

# Set permissions (if needed)
icacls wattar-academy-key.pem /inheritance:r
icacls wattar-academy-key.pem /grant:r "%username%:R"

# Connect (replace YOUR-IP with your instance's Public IP)
ssh -i wattar-academy-key.pem ubuntu@YOUR-INSTANCE-IP
```

### Step 4: Install Docker (5 min)

Once connected, run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
```

**Reconnect to your instance** (same SSH command as before)

```bash
# Verify installation
docker --version
docker-compose --version
```

### Step 5: Upload Your Application (10 min)

**Option A: Using SCP (From your Windows computer)**

```powershell
# In PowerShell on your local computer
cd D:\Watar

# Upload all files (replace YOUR-IP)
scp -i Downloads\wattar-academy-key.pem -r * ubuntu@YOUR-INSTANCE-IP:/home/ubuntu/wattar-academy/
```

**Option B: Using Git (If you have GitHub)**

```bash
# On your EC2 instance
cd /home/ubuntu
git clone https://github.com/yourusername/wattar-academy.git
cd wattar-academy
```

**Option C: Manual Upload (Easiest for small files)**

```bash
# On EC2 instance, create directory
mkdir -p /home/ubuntu/wattar-academy
cd /home/ubuntu/wattar-academy

# Then use EC2 Instance Connect file upload feature
# Or copy-paste file contents one by one
```

### Step 6: Prepare Application (5 min)

```bash
cd /home/ubuntu/wattar-academy

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
SESSION_SECRET=change-this-to-random-32-character-string
DB_PATH=/app/wattar.db
EOF

# Make sure wattar.db exists
ls -la wattar.db

# If database doesn't exist, you'll need to upload it
```

### Step 7: Start with Docker (2 min)

```bash
# Build and start
docker-compose up -d

# Check if running
docker-compose ps

# View logs
docker-compose logs -f
```

Press `Ctrl+C` to exit logs.

### Step 8: Access Your Application! 🎉

1. Go to EC2 Dashboard
2. Find your instance's **Public IPv4 address**
3. Open browser: `http://YOUR-PUBLIC-IP:3000`
4. You should see the login page!
5. Login: admin / admin123

---

## 🔒 Secure Your Application (IMPORTANT!)

### 1. Change Admin Password Immediately

```bash
cd /home/ubuntu/wattar-academy

# Create password change script
cat > change-password.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./wattar.db');

const newPassword = 'YOUR-NEW-SECURE-PASSWORD'; // Change this!
const hashedPassword = bcrypt.hashSync(newPassword, 10);

db.run('UPDATE users SET password_hash = ? WHERE username = ?', 
  [hashedPassword, 'admin'], 
  (err) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Password updated successfully!');
    }
    db.close();
  }
);
EOF

# Run inside Docker container
docker exec -i wattar-academy node << 'SCRIPT'
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./wattar.db');
const newPass = bcrypt.hashSync('YOUR-NEW-PASSWORD', 10);
db.run('UPDATE users SET password_hash = ? WHERE username = ?', [newPass, 'admin'], () => db.close());
SCRIPT
```

### 2. Update Session Secret

```bash
# Edit .env file
nano .env

# Change SESSION_SECRET to a random string
# Generate one at: https://randomkeygen.com/
# Or use: openssl rand -base64 32
```

Restart application:
```bash
docker-compose restart
```

---

## 💰 Staying Within Free Tier

### Free Tier Limits (12 months):
- ✅ **750 hours/month** of t2.micro (one instance 24/7 = 720 hours)
- ✅ **30 GB** of EBS storage
- ✅ **15 GB** of data transfer OUT per month
- ✅ **1 GB** of data transfer IN (always free)

### Tips to Stay Free:
1. **Use only ONE t2.micro instance**
2. **Stop instance when not in use** (saves hours)
3. **Monitor your usage** in AWS Billing Dashboard
4. **Set up billing alerts** (see below)
5. **Don't exceed 15 GB bandwidth/month**

### Set Up Billing Alert (IMPORTANT!)

1. Go to **AWS Billing Dashboard**
2. Click **Budgets** in left menu
3. Click **Create budget**
4. Choose **Zero spend budget** (alerts when you exceed free tier)
5. Enter your email
6. Click **Create budget**

You'll get email alerts if you start incurring charges!

---

## 📊 Monitor Your Free Tier Usage

1. Go to **AWS Billing Dashboard**
2. Click **Free Tier** in left menu
3. See your usage for:
   - EC2 hours used
   - Storage used
   - Data transfer used

Check this weekly to ensure you're staying free!

---

## 🔄 Maintenance Commands

### Check Application Status
```bash
docker-compose ps
docker-compose logs --tail=50
```

### Restart Application
```bash
docker-compose restart
```

### Stop Application (Save EC2 hours)
```bash
docker-compose down
```

### Start Application Again
```bash
docker-compose up -d
```

### Update Application
```bash
cd /home/ubuntu/wattar-academy
# Upload new files
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup Database
```bash
# Create backup
docker exec wattar-academy cp /app/wattar.db /app/data/backup_$(date +%Y%m%d).db

# Download backup to your computer
scp -i wattar-academy-key.pem ubuntu@YOUR-IP:/home/ubuntu/wattar-academy/data/backup_*.db ./
```

---

## 🛑 Stop EC2 Instance (When Not Using)

**To save free tier hours when not using:**

1. Go to EC2 Dashboard
2. Select your instance
3. Click **Instance state** → **Stop instance**
4. Instance stops (no charges, but data persists)

**To start again:**
1. Select instance
2. Click **Instance state** → **Start instance**
3. **Note:** Public IP will change! Update your bookmarks

**Important:** Stopping saves hours, but storage still counts toward free tier (30 GB limit).

---

## 🆘 Troubleshooting

### Can't connect to instance
```bash
# Check security group allows port 3000
# Check instance is running
# Try: curl http://localhost:3000 (from inside instance)
```

### Docker container not starting
```bash
docker-compose logs wattar-academy
docker-compose down
docker-compose up -d
```

### Out of memory (t2.micro has only 1GB)
```bash
# Check memory usage
free -h

# Restart Docker
sudo systemctl restart docker
docker-compose up -d
```

### Application slow
- t2.micro has limited CPU
- Consider upgrading after free tier (costs ~$8/month for t3.small)
- Or optimize your application

---

## 📈 After Free Tier Ends (12 months)

### Option 1: Continue with EC2
- **t2.micro:** ~$8-10/month
- **t3.micro:** ~$7-9/month (better performance)

### Option 2: Switch to Lightsail
- **$3.50/month:** 512 MB RAM
- **$5/month:** 1 GB RAM (recommended)
- Simpler pricing, easier to manage

### Option 3: Optimize and Stay on Free Tier
- Some services remain free forever:
  - 1 GB data transfer IN (always free)
  - AWS Lambda (1M requests/month free)
  - DynamoDB (25 GB storage free)

---

## ✅ Free Deployment Checklist

- [ ] Create AWS account
- [ ] Launch t2.micro EC2 instance (free tier)
- [ ] Configure security groups (ports 22, 80, 3000)
- [ ] Save SSH key file
- [ ] Connect to instance
- [ ] Install Docker and Docker Compose
- [ ] Upload application files
- [ ] Create .env file
- [ ] Start with docker-compose
- [ ] Access application in browser
- [ ] Change admin password
- [ ] Update session secret
- [ ] Set up billing alerts
- [ ] Test application thoroughly
- [ ] Set up database backups

---

## 🎉 Success! You're Running FREE on AWS!

**Your application is now:**
- ✅ Running on AWS Free Tier
- ✅ Dockerized and portable
- ✅ Accessible from anywhere
- ✅ FREE for 12 months!

**Access your app:**
- `http://YOUR-EC2-PUBLIC-IP:3000`

**Costs:**
- **First 12 months:** $0 (FREE!)
- **After 12 months:** ~$8-10/month (or switch to Lightsail for $5/month)

---

## 📞 Quick Reference

### Essential Commands
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop (save hours)
docker-compose down

# Start
docker-compose up -d

# Backup database
docker exec wattar-academy cp /app/wattar.db /app/data/backup.db
```

### Important URLs
- AWS Console: https://console.aws.amazon.com
- Billing Dashboard: https://console.aws.amazon.com/billing
- EC2 Dashboard: https://console.aws.amazon.com/ec2
- Free Tier Usage: https://console.aws.amazon.com/billing/home#/freetier

---

## 💡 Pro Tips

1. **Set up Elastic IP (Free!)** - Get a permanent IP address
   - Go to EC2 → Elastic IPs
   - Allocate new address
   - Associate with your instance
   - Now your IP won't change when you stop/start!

2. **Enable CloudWatch Monitoring** - Free basic monitoring
   - See CPU, network, disk usage
   - Set up alarms

3. **Automate Backups**
   ```bash
   # Add to crontab
   crontab -e
   # Add this line (daily backup at 2 AM):
   0 2 * * * docker exec wattar-academy cp /app/wattar.db /app/data/backup_$(date +\%Y\%m\%d).db
   ```

4. **Use AWS Systems Manager Session Manager** - Connect without SSH key
   - More secure
   - No need to manage SSH keys
   - Free to use

---

**Deployment Time:** 30-45 minutes  
**Cost:** $0 for 12 months! 🎉  
**Difficulty:** Easy ⭐⭐☆☆☆

Enjoy your FREE AWS deployment! 🚀

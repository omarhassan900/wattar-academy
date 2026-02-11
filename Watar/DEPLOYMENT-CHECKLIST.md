# AWS Deployment Checklist

## ✅ Pre-Deployment

### Local Preparation
- [ ] Run `node deploy-production.js` to verify system
- [ ] Run `node prepare-for-aws.js` to check files
- [ ] Backup database locally
- [ ] Test application locally one more time
- [ ] Read AWS-DEPLOYMENT-GUIDE.md

### AWS Account Setup
- [ ] Create AWS account
- [ ] Add payment method
- [ ] Verify email address

---

## ✅ AWS Lightsail Setup

### Instance Creation
- [ ] Login to AWS Console
- [ ] Navigate to Lightsail
- [ ] Create new instance
- [ ] Select Ubuntu 20.04 LTS
- [ ] Choose $5/month plan (1GB RAM)
- [ ] Name instance: wattar-academy
- [ ] Wait for instance to start

### Network Configuration
- [ ] Open port 3000 in firewall
- [ ] Create static IP (optional but recommended)
- [ ] Note down public IP address

---

## ✅ Server Setup

### Software Installation
- [ ] Connect via SSH
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Install Node.js 18.x
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Verify installations

### Application Deployment
- [ ] Create directory: `/home/ubuntu/wattar-academy`
- [ ] Upload all application files
- [ ] Upload views/ folder
- [ ] Upload wattar.db database
- [ ] Verify all files uploaded correctly

### Dependencies
- [ ] Run `npm install`
- [ ] Check for errors
- [ ] Verify node_modules created

---

## ✅ Application Configuration

### Security Updates
- [ ] Change admin password in database
- [ ] Change trainer passwords
- [ ] Update session secret in server.js
- [ ] Set NODE_ENV=production (optional)

### Application Start
- [ ] Start with PM2: `pm2 start server.js --name wattar-academy`
- [ ] Check status: `pm2 status`
- [ ] View logs: `pm2 logs wattar-academy`
- [ ] Save PM2 config: `pm2 save`
- [ ] Enable auto-start: `pm2 startup`

---

## ✅ Testing

### Basic Functionality
- [ ] Access app: `http://YOUR-IP:3000`
- [ ] Login page loads
- [ ] Login with admin credentials
- [ ] Dashboard displays correctly
- [ ] Navigate to Students page
- [ ] Navigate to Attendance page
- [ ] Navigate to Cash Management
- [ ] Navigate to User Management
- [ ] Test logout

### Feature Testing
- [ ] Add a test student
- [ ] Edit student information
- [ ] Mark attendance for a session
- [ ] Add a cash transaction
- [ ] View session summary
- [ ] Generate a report
- [ ] Add a new user
- [ ] Test trainer login

---

## ✅ Production Hardening

### Security
- [ ] Set up UFW firewall
- [ ] Configure fail2ban (optional)
- [ ] Disable root SSH login (optional)
- [ ] Set up SSH key authentication (optional)

### Backups
- [ ] Create backup script
- [ ] Test backup script
- [ ] Set up cron job for daily backups
- [ ] Test backup restoration
- [ ] Document backup location

### Monitoring
- [ ] Set up PM2 monitoring
- [ ] Configure log rotation
- [ ] Set up CloudWatch alarms (optional)
- [ ] Test email alerts (optional)

---

## ✅ Domain & SSL (Optional)

### Domain Setup
- [ ] Purchase domain name
- [ ] Create DNS zone in Lightsail
- [ ] Add A record pointing to static IP
- [ ] Update nameservers at registrar
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Test domain access

### SSL Certificate
- [ ] Install Nginx
- [ ] Configure Nginx reverse proxy
- [ ] Install Certbot
- [ ] Obtain SSL certificate
- [ ] Test HTTPS access
- [ ] Set up auto-renewal

---

## ✅ Documentation

### Team Training
- [ ] Document login credentials
- [ ] Create user manual
- [ ] Train staff on system usage
- [ ] Document common tasks
- [ ] Create troubleshooting guide

### Maintenance Procedures
- [ ] Document backup procedure
- [ ] Document update procedure
- [ ] Document restart procedure
- [ ] Create emergency contacts list
- [ ] Schedule regular maintenance

---

## ✅ Go Live

### Final Checks
- [ ] All features working
- [ ] All passwords changed
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Team trained
- [ ] Documentation complete

### Launch
- [ ] Announce to team
- [ ] Monitor for first 24 hours
- [ ] Check logs regularly
- [ ] Be available for support
- [ ] Celebrate! 🎉

---

## 📊 Post-Deployment

### Week 1
- [ ] Monitor daily
- [ ] Check logs for errors
- [ ] Verify backups running
- [ ] Collect user feedback
- [ ] Address any issues

### Month 1
- [ ] Review performance
- [ ] Check costs
- [ ] Optimize if needed
- [ ] Update documentation
- [ ] Plan improvements

---

## 🆘 Emergency Contacts

**AWS Support:** https://console.aws.amazon.com/support/  
**Lightsail Docs:** https://lightsail.aws.amazon.com/ls/docs  
**PM2 Docs:** https://pm2.keymetrics.io/docs

---

## 📝 Deployment Information

**Date Deployed:** _______________  
**AWS Region:** _______________  
**Instance IP:** _______________  
**Domain:** _______________  
**Deployed By:** _______________

---

## ✅ Deployment Complete!

**Status:** [ ] In Progress  [ ] Complete  
**Date:** _______________  
**Notes:** _______________

---

**Keep this checklist for future reference and updates!**

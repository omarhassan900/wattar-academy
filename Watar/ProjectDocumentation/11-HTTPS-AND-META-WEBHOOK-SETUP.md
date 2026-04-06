# HTTPS Setup & Meta Lead Ads Webhook Integration

This guide walks you through adding HTTPS to your Wattar Academy server and then connecting Meta (Facebook/Instagram) Lead Ads to automatically import leads into your system.

---

## Why HTTPS?

- Meta requires HTTPS for webhooks — no exceptions
- Your app currently sends passwords and session cookies over plain HTTP
- HTTPS is free with Let's Encrypt
- Takes about 10-15 minutes to set up

## Architecture After Setup

```
Customer fills Facebook Lead Form
    → Meta sends webhook to https://yourdomain.com/api/meta-leads
    → Nginx (port 443, SSL) → Docker App (port 3000)
    → Lead automatically created in your system
```

```
Browser (HTTPS:443) → Nginx (SSL termination) → Docker (HTTP:3000)
```

---

## Phase 1: Get a Domain Name

You need a domain name pointing to your AWS EC2 public IP.

### Option A: You already own a domain

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add an A record:
   - Host: `@` (or a subdomain like `app`)
   - Type: `A`
   - Value: `YOUR_AWS_EC2_PUBLIC_IP`
   - TTL: 300
3. Wait 5-10 minutes for DNS propagation

### Option B: Get a free subdomain

1. Go to https://freedns.afraid.org
2. Sign up (free account)
3. Go to "Subdomains" → "Add a subdomain"
4. Choose a name like `wattar` and pick a domain (e.g., `mooo.com`)
5. Type: A
6. Destination: `YOUR_AWS_EC2_PUBLIC_IP`
7. Save

### Verify DNS

Wait a few minutes, then test:
```bash
ping yourdomain.com
# Should resolve to your AWS IP
```

Or use: https://dnschecker.org to verify propagation.

---

## Phase 2: Open Ports on AWS Security Group

Your EC2 instance needs ports 80 (HTTP) and 443 (HTTPS) open.

1. Go to AWS Console → EC2 → Instances
2. Click your instance → Security tab
3. Click the Security Group link
4. Click "Edit inbound rules"
5. Add these rules (if not already present):

| Type  | Port | Source    |
|-------|------|-----------|
| HTTP  | 80   | 0.0.0.0/0 |
| HTTPS | 443  | 0.0.0.0/0 |

6. Click "Save rules"

You probably already have port 3000 open — keep it for now, you can remove it later once Nginx is working.

---

## Phase 3: Install Nginx on EC2

SSH into your server:
```bash
ssh ec2-user@YOUR_AWS_IP
```

Install Nginx:
```bash
# Amazon Linux 2
sudo amazon-linux-extras install nginx1 -y

# Amazon Linux 2023
sudo yum install nginx -y

# Ubuntu
sudo apt install nginx -y
```

Start and enable Nginx:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

Verify: visit `http://yourdomain.com` in your browser — you should see the Nginx welcome page.

---

## Phase 4: Configure Nginx as Reverse Proxy

Create a config file for your app:
```bash
sudo nano /etc/nginx/conf.d/wattar.conf
```

Paste this (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

If there's a default server block conflicting, remove or comment it out:
```bash
# Check for default config
sudo cat /etc/nginx/nginx.conf
# If there's a "server { listen 80; ... }" block in there, comment it out
```

Test and reload:
```bash
sudo nginx -t              # Should say "syntax is ok" and "test is successful"
sudo systemctl reload nginx
```

Verify: visit `http://yourdomain.com` — you should see your Wattar Academy app (no :3000 needed).

---

## Phase 5: Install SSL Certificate with Certbot (Free HTTPS)

Install Certbot:
```bash
# Amazon Linux 2
sudo amazon-linux-extras install epel -y
sudo yum install certbot python3-certbot-nginx -y

# Amazon Linux 2023
sudo yum install certbot python3-certbot-nginx -y

# Ubuntu
sudo apt install certbot python3-certbot-nginx -y
```

Get the certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

Certbot will ask:
1. Your email address (for renewal notices) → enter it
2. Agree to terms → Y
3. Share email with EFF → your choice (N is fine)
4. Redirect HTTP to HTTPS → choose 2 (Redirect) — recommended

Certbot automatically:
- Gets a free SSL certificate from Let's Encrypt
- Modifies your Nginx config to add SSL
- Sets up HTTP → HTTPS redirect

Verify: visit `https://yourdomain.com` — you should see your app with a padlock icon.

---

## Phase 6: Auto-Renew SSL Certificate

Let's Encrypt certificates expire every 90 days. Certbot usually sets up auto-renewal automatically.

Test that renewal works:
```bash
sudo certbot renew --dry-run
```

If it says "Congratulations, all renewals succeeded" — you're good.

If auto-renewal isn't set up, add it manually:
```bash
# Add a cron job to renew twice daily (only renews if needed)
echo "0 0,12 * * * root certbot renew --quiet" | sudo tee /etc/cron.d/certbot-renew
```

---

## Phase 7: Meta Lead Ads Webhook Integration

Once HTTPS is working, you can connect Meta Lead Ads.

### Step 1: Create a Meta App

1. Go to https://developers.facebook.com
2. Click "My Apps" → "Create App"
3. Choose "Business" type
4. Name it (e.g., "Wattar Academy Leads")
5. Once created, go to App Dashboard

### Step 2: Set Up Webhooks

1. In your Meta App, go to "Add Product" → find "Webhooks" → Set Up
2. Select "Page" from the dropdown
3. Click "Subscribe to this topic"
4. Callback URL: `https://yourdomain.com/api/meta-leads/webhook`
5. Verify Token: choose a secret string (e.g., `wattar_leads_secret_2024`) — you'll use this in your server code
6. Click "Verify and Save"

### Step 3: Subscribe to Lead Events

1. In Webhooks settings, find `leadgen` in the list
2. Click "Subscribe" next to it
3. This tells Meta to send lead form submissions to your webhook

### Step 4: Get a Page Access Token

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app
3. Click "Get User Access Token"
4. Check permissions: `pages_manage_ads`, `leads_retrieval`, `pages_show_list`, `pages_read_engagement`
5. Click "Generate Access Token"
6. Then exchange it for a Page Access Token:
   - Select your Facebook Page from the dropdown
   - Copy the Page Access Token
7. For a long-lived token (doesn't expire), use the Access Token Debugger to extend it

### Step 5: Add the Webhook Endpoint to Your Server

This is the code part — I'll build this for you when you're ready. It will:
- Verify the webhook with Meta (GET request)
- Receive lead notifications (POST request)
- Fetch lead details from Meta Graph API
- Insert the lead into your `leads` table automatically

### Step 6: Test

1. Go to Meta Ads Manager
2. Create a test lead form (or use an existing one)
3. Use the "Test" button in the Meta App Webhooks settings
4. Check your Wattar Academy leads page — the test lead should appear

---

## Troubleshooting

### Nginx won't start
```bash
sudo nginx -t                    # Check for config errors
sudo journalctl -u nginx -n 50  # View logs
```

### Certbot fails
```bash
# Make sure port 80 is open in security group
# Make sure DNS is pointing to your IP
nslookup yourdomain.com
```

### Can't reach the app through Nginx
```bash
# Check if Docker container is running
docker ps | grep wattar

# Check if Nginx is running
sudo systemctl status nginx

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate won't renew
```bash
sudo certbot renew --dry-run --debug
sudo certbot certificates    # Check expiry dates
```

---

## Quick Reference

```bash
# === Nginx Commands ===
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl reload nginx     # Reload config without downtime
sudo nginx -t                   # Test config syntax

# === Certbot Commands ===
sudo certbot --nginx -d yourdomain.com    # Get new certificate
sudo certbot renew --dry-run              # Test renewal
sudo certbot certificates                 # List certificates

# === Check Everything ===
curl -I https://yourdomain.com            # Should return 200
docker ps                                 # Container running?
sudo systemctl status nginx               # Nginx running?
```

---

## Summary of What Changes

| Before | After |
|--------|-------|
| `http://YOUR_IP:3000` | `https://yourdomain.com` |
| No encryption | Full SSL/TLS encryption |
| Can't use Meta webhooks | Meta webhooks ready |
| Passwords sent in plain text | Passwords encrypted in transit |

---

**Cost: $0** (Let's Encrypt is free, Nginx is free, free subdomain available)
**Time: ~15 minutes** for HTTPS, then ~30 minutes for Meta webhook setup

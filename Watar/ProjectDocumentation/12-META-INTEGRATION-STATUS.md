# Meta Lead Ads Integration — Status & Remaining Steps

## Current Status: 80% Complete

The webhook is live and subscribed. Leads will be received but with limited details until the Page Token is configured.

---

## What's Done ✅

### 1. HTTPS Setup ✅
- Domain: `watar.academy.mooo.com` (FreeDNS)
- SSL: Let's Encrypt via Certbot (auto-renews)
- Nginx reverse proxy: port 443 → Docker port 3000
- Live at: https://watar.academy.mooo.com

### 2. Meta Developer App Created ✅
- App Name: Watar Academy
- App ID: `2080966649145171`
- App Type: Business
- Link: https://developers.facebook.com/apps/2080966649145171/

### 3. Webhook Endpoint Built & Deployed ✅
- Code: `routes/meta-webhook.js`
- Callback URL: `https://watar.academy.mooo.com/api/meta-leads/webhook`
- Verify Token: `wattar_leads_2024`

### 4. Webhook Verified with Meta ✅
- Meta successfully verified the endpoint
- Link: https://developers.facebook.com/apps/2080966649145171/webhooks/

### 5. Leadgen Subscription Active ✅
- `leadgen` field is subscribed under Page webhooks
- Meta will send notifications when lead forms are submitted

---

## What's NOT Done Yet ❌

### 6. Add App to wataraat Business Portfolio ❌
**Status:** Blocked — account temporarily restricted by Meta (too many actions)
**Wait:** Try again in a few hours or next day

**Steps when restriction lifts:**
1. Go to: https://business.facebook.com/latest/settings/apps (make sure "wataraat" is selected)
2. Click "+ Add"
3. Enter App ID: `2080966649145171`
4. Click "Add App"
5. The app will be added to the wataraat business

### 7. Get Page Access Token ❌
**Status:** Blocked — depends on Step 6

**Steps after Step 6 is done:**
1. Go to: https://developers.facebook.com/tools/explorer/
2. Select "Watar Academy" app
3. Click "Generate Access Token"
4. Grant permissions: `email`, `pages_show_list`, `leads_retrieval`, `pages_read_engagement`, `pages_manage_ads`
5. In "User or Page" dropdown, select "وتر - Watar" page
6. Copy the Page Access Token (long string starting with EAA...)

### 8. Configure Page Token on Server ❌
**Status:** Blocked — depends on Step 7

**Steps after you have the token:**

Option A — Environment variable in docker-compose.yml:
```bash
ssh ec2-user@YOUR-AWS-IP
cd ~/wattar
nano docker-compose.yml
```
Add under `environment`:
```yaml
- META_PAGE_TOKEN=YOUR_PAGE_ACCESS_TOKEN_HERE
```
Then:
```bash
docker-compose down
docker-compose up -d
```

Option B — Set directly in the code (simpler but less secure):
Edit `routes/meta-webhook.js` line 4:
```javascript
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_TOKEN || 'PASTE_YOUR_TOKEN_HERE';
```
Then commit, push, and rebuild Docker.

### 9. Subscribe Watar Page to the App ❌
**Status:** Blocked — depends on Step 7

**Steps after you have the Page Token:**
In Graph API Explorer, with the Page Token selected, run:
```
POST: {page-id}/subscribed_apps?subscribed_fields=leadgen
```
Where `{page-id}` is `430346197475145` (Watar page ID)

Or run this URL:
```
430346197475145/subscribed_apps?subscribed_fields=leadgen
```
Method: POST, then click Submit.

This tells Meta: "Send leadgen events from THIS page to my app's webhook."

### 10. Test End-to-End ❌
**Status:** Blocked — depends on Steps 8 & 9

**How to test:**
1. Go to: https://developers.facebook.com/apps/2080966649145171/webhooks/
2. Find `leadgen` in the list
3. Click "Test" next to it
4. Check Docker logs: `docker logs wattar-academy --tail 20`
5. Check your Leads page in the app — a test lead should appear

**For real testing:**
1. Create a test Lead Ad campaign on the Watar page
2. Submit the form yourself
3. The lead should appear in your system within seconds

---

## Key Information Reference

| Item | Value |
|------|-------|
| Domain | watar.academy.mooo.com |
| App Name | Watar Academy |
| App ID | 2080966649145171 |
| Watar Page ID | 430346197475145 |
| Webhook URL | https://watar.academy.mooo.com/api/meta-leads/webhook |
| Verify Token | wattar_leads_2024 |
| Business Portfolio | wataraat |
| Webhook Code | routes/meta-webhook.js |
| Status Check URL | https://watar.academy.mooo.com/api/meta-leads/status (login as manager) |

## Important Links

| What | URL |
|------|-----|
| Meta App Dashboard | https://developers.facebook.com/apps/2080966649145171/ |
| Webhooks Settings | https://developers.facebook.com/apps/2080966649145171/webhooks/ |
| Graph API Explorer | https://developers.facebook.com/tools/explorer/ |
| Business Settings (wataraat) | https://business.facebook.com/latest/settings/ |
| Business Apps | https://business.facebook.com/latest/settings/apps |
| Business Pages | https://business.facebook.com/latest/settings/pages |
| FreeDNS (domain) | https://freedns.afraid.org |
| Your App (HTTPS) | https://watar.academy.mooo.com |

## Token Expiration Note

The Page Access Token from Graph API Explorer is short-lived (expires in ~1 hour). To get a long-lived token:

1. Get the short-lived token from Graph API Explorer
2. Go to: https://developers.facebook.com/tools/debug/accesstoken/
3. Paste the token → click "Debug"
4. Click "Extend Access Token" at the bottom
5. Copy the new long-lived token (lasts ~60 days)

For a permanent (never-expiring) token, use a System User in the business settings instead of a personal token.

---

## What Happens Right Now (Without Page Token)

When a lead submits a form on your Meta ad:
1. Meta sends a webhook notification to your server ✅
2. Your server receives the leadgen_id ✅
3. Your server tries to fetch lead details from Meta API ❌ (no token)
4. A placeholder lead is saved: "Meta Lead #12345" with the leadgen ID in notes ✅
5. You can see it in your Leads page ✅

Once the Page Token is configured, Step 3 will work and you'll get the full name, phone, email, etc.

# RetroWire - AWS Deployment Guide (Free Tier)

**Complete Step-by-Step Guide to Deploy RetroWire on AWS with Custom Domain**

---

## Overview

This guide will help you deploy RetroWire as a web application on AWS Free Tier using:
- **S3** - Static website hosting (Free Tier: 5GB storage, 20,000 GET requests/month)
- **CloudFront** - CDN for fast global delivery (Free Tier: 1TB data transfer out/month)
- **Route 53** - DNS management for custom domain ($0.50/month per hosted zone)
- **Certificate Manager** - Free SSL certificates

**Estimated Monthly Cost:** $0.50 - $1.00 (mostly Route 53 DNS)

---

## Prerequisites

Before starting, you need:
1. ✅ AWS Account (create at https://aws.amazon.com)
2. ✅ Custom domain name (e.g., retrowire.com from Namecheap, GoDaddy, etc.)
3. ✅ Git installed on your computer
4. ✅ Node.js and npm installed

---

## Part 1: Prepare Your Application

### Step 1.1: Build the Web Application

Open your terminal in the RetroWire project folder:

```bash
# Build the production version (web app, not Electron)
npm run build
```

This creates a `dist/` folder with your static website files.

**What's Inside dist/:**
- index.html
- assets/ (JavaScript, CSS files)
- favicon, icons, etc.

### Step 1.2: Test the Build Locally

```bash
# Preview the production build
npm run preview
```

Visit `http://localhost:4173` to verify everything works.

---

## Part 2: Set Up AWS S3 for Hosting

### Step 2.1: Create an S3 Bucket

1. Log into **AWS Console**: https://console.aws.amazon.com
2. Go to **S3** service (search "S3" in top search bar)
3. Click **"Create bucket"**

**Bucket Configuration:**
- **Bucket name:** `retrowire-app` (must be globally unique)
  - If taken, try: `retrowire-yourname`, `retrowire-2024`, etc.
- **Region:** Choose closest to your users (e.g., `us-east-1` for US East)
- **Block Public Access:** ⚠️ **UNCHECK ALL boxes** (we need public access for website)
  - Uncheck "Block all public access"
  - Check the acknowledgment box
- Click **"Create bucket"**

### Step 2.2: Enable Static Website Hosting

1. Click on your new bucket name
2. Go to **"Properties"** tab
3. Scroll to bottom → **"Static website hosting"**
4. Click **"Edit"**

**Configuration:**
- **Static website hosting:** Enable
- **Hosting type:** Host a static website
- **Index document:** `index.html`
- **Error document:** `index.html` (for React Router support)
- Click **"Save changes"**

**📝 Note the Endpoint URL** (looks like: `http://retrowire-app.s3-website-us-east-1.amazonaws.com`)

### Step 2.3: Set Bucket Policy (Make Public)

1. Go to **"Permissions"** tab
2. Scroll to **"Bucket policy"**
3. Click **"Edit"**
4. Paste this policy (replace `retrowire-app` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::retrowire-app/*"
    }
  ]
}
```

5. Click **"Save changes"**

---

## Part 3: Upload Your Application

### Step 3.1: Upload Files to S3

**Option A: Using AWS Console (Easy)**

1. Click on your bucket name
2. Click **"Upload"**
3. Click **"Add files"** and **"Add folder"**
4. Select ALL files from your `dist/` folder:
   - index.html
   - assets/ folder
   - Any other files in dist/
5. Click **"Upload"**
6. Wait for upload to complete

**Option B: Using AWS CLI (Advanced)**

```bash
# Install AWS CLI first: https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure

# Upload entire dist folder
aws s3 sync dist/ s3://retrowire-app/ --delete
```

### Step 3.2: Test S3 Website

Visit your S3 website endpoint:
```
http://retrowire-app.s3-website-us-east-1.amazonaws.com
```

RetroWire should now be live! 🎉

---

## Part 4: Set Up CloudFront CDN

### Step 4.1: Create CloudFront Distribution

1. Go to **CloudFront** service in AWS Console
2. Click **"Create distribution"**

**Origin Settings:**
- **Origin domain:** Click the dropdown, select your S3 bucket
  - Or paste: `retrowire-app.s3.us-east-1.amazonaws.com`
- **Origin path:** Leave empty
- **Name:** Leave auto-generated
- **Origin access:** Public

**Default Cache Behavior:**
- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Allowed HTTP methods:** GET, HEAD
- **Cache policy:** CachingOptimized

**Settings:**
- **Price class:** Use all edge locations (best performance on free tier)
- **Alternate domain name (CNAME):** Leave empty for now (we'll add later)
- **Custom SSL certificate:** Leave as default for now
- **Default root object:** `index.html`

3. Click **"Create distribution"**
4. **Wait 5-15 minutes** for deployment (status will change from "Deploying" to "Enabled")

**📝 Note the Distribution Domain Name** (looks like: `d1234abcd5678.cloudfront.net`)

### Step 4.2: Test CloudFront

Visit your CloudFront URL:
```
https://d1234abcd5678.cloudfront.net
```

RetroWire should load over HTTPS! 🔒

---

## Part 5: Set Up Custom Domain

### Step 5.1: Create SSL Certificate

1. Go to **AWS Certificate Manager** (ACM)
2. **⚠️ IMPORTANT:** Make sure region is **us-east-1** (N. Virginia)
   - CloudFront requires certificates in us-east-1
3. Click **"Request certificate"**

**Certificate Configuration:**
- **Certificate type:** Request a public certificate
- Click **"Next"**
- **Domain names:**
  - Add: `retrowire.com` (your domain)
  - Add: `www.retrowire.com` (with www)
  - Click **"Add another name to this certificate"** for each
- **Validation method:** DNS validation (recommended)
- Click **"Request"**

**📝 Keep this page open** - you'll need the DNS records

### Step 5.2: Validate Certificate

**You have two options:**

#### Option A: If Your Domain is on Route 53 (Easy)
1. Click **"Create records in Route 53"** button
2. Click **"Create records"**
3. Done! Wait 5-30 minutes for validation

#### Option B: If Your Domain is External (e.g., Namecheap, GoDaddy)
1. AWS will show CNAME records you need to add
2. Copy the **Name** and **Value** for each domain
3. Log into your domain registrar
4. Add DNS CNAME records:
   - **Type:** CNAME
   - **Name:** (from AWS, looks like `_abc123.retrowire.com`)
   - **Value:** (from AWS, looks like `_xyz789.acm-validations.aws`)
5. Wait 5-30 minutes for validation
6. Certificate status will change to "Issued"

**Wait for "Issued" status before continuing**

---

## Part 6: Configure Route 53 (DNS)

### Step 6.1: Create Hosted Zone

1. Go to **Route 53** service
2. Click **"Hosted zones"**
3. Click **"Create hosted zone"**

**Configuration:**
- **Domain name:** `retrowire.com` (your domain)
- **Type:** Public hosted zone
- Click **"Create hosted zone"**

**📝 Note the Nameservers** (4 values like `ns-123.awsdns-12.com`)

### Step 6.2: Update Domain Nameservers

Go to your domain registrar (Namecheap, GoDaddy, etc.) and update nameservers:

**Namecheap Example:**
1. Log into Namecheap
2. Go to Domain List → Click "Manage"
3. Find "Nameservers" section
4. Select "Custom DNS"
5. Enter the 4 AWS nameservers (from Route 53)
6. Save changes

**⏰ Wait 24-48 hours for DNS propagation** (usually faster)

### Step 6.3: Create DNS Records

Back in Route 53 Hosted Zone:

#### Record 1: Root Domain (retrowire.com)
1. Click **"Create record"**
- **Record name:** Leave empty (for root domain)
- **Record type:** A
- **Alias:** YES (toggle on)
- **Route traffic to:** 
  - Select "Alias to CloudFront distribution"
  - Select your CloudFront distribution
- Click **"Create records"**

#### Record 2: WWW Subdomain (www.retrowire.com)
1. Click **"Create record"**
- **Record name:** `www`
- **Record type:** A
- **Alias:** YES
- **Route traffic to:**
  - Select "Alias to CloudFront distribution"
  - Select your CloudFront distribution
- Click **"Create records"**

---

## Part 7: Add Custom Domain to CloudFront

### Step 7.1: Update CloudFront Distribution

1. Go back to **CloudFront**
2. Click on your distribution ID
3. Click **"Edit"** (General tab)

**Update Settings:**
- **Alternate domain names (CNAMEs):**
  - Add: `retrowire.com`
  - Add: `www.retrowire.com`
- **Custom SSL certificate:**
  - Select your ACM certificate (must show "Issued" status)
- Click **"Save changes"**

**⏰ Wait 5-10 minutes for CloudFront to update**

---

## Part 8: Test Your Deployment

### Step 8.1: Test All URLs

Test these URLs in your browser:

1. ✅ CloudFront URL: `https://d1234abcd5678.cloudfront.net`
2. ✅ Custom domain: `https://retrowire.com`
3. ✅ WWW subdomain: `https://www.retrowire.com`
4. ✅ HTTP redirect: `http://retrowire.com` (should redirect to HTTPS)

All should show RetroWire running!

### Step 8.2: Verify HTTPS

Click the padlock icon in browser - should show valid SSL certificate for your domain.

---

## Part 9: Deploy Updates

### When You Make Changes:

```bash
# 1. Build new version
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://retrowire-app/ --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Or using AWS Console:**
1. Upload new files to S3 bucket (overwrite existing)
2. Go to CloudFront → Invalidations → Create invalidation
3. Enter: `/*` and click "Create"

---

## Part 10: Optimization (Optional)

### Enable Gzip Compression

**In CloudFront Distribution:**
1. Edit distribution
2. **Compress objects automatically:** Yes
3. Save

### Set Cache Headers

Add to `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          reactflow: ['@xyflow/react'],
        }
      }
    }
  }
});
```

---

## Costs Breakdown (Free Tier)

### What's Free:
- **S3:** 5GB storage, 20,000 GET requests, 2,000 PUT requests (12 months free)
- **CloudFront:** 1TB data transfer out, 10,000,000 requests (12 months free)
- **ACM Certificates:** Always free
- **Data Transfer:** First 100GB/month free (12 months)

### What Costs Money:
- **Route 53 Hosted Zone:** $0.50/month
- **Route 53 Queries:** $0.40 per million queries (first million free)
- **After Free Tier Expires:**
  - S3: ~$0.023 per GB/month
  - CloudFront: $0.085 per GB
  
**Estimated Monthly Cost for Typical Usage:**
- **First Year:** $0.50 - $1.00/month
- **After Year 1:** $2.00 - $5.00/month (depending on traffic)

---

## Troubleshooting

### Issue: "Access Denied" when visiting S3 URL
**Solution:** Check bucket policy allows public access

### Issue: Certificate shows "Pending validation"
**Solution:** Verify DNS records are added correctly, wait longer (up to 24 hours)

### Issue: Custom domain doesn't work
**Solution:** 
- Verify nameservers updated at registrar
- Wait 24-48 hours for DNS propagation
- Check Route 53 records point to CloudFront

### Issue: CloudFront shows old version after update
**Solution:** Create CloudFront invalidation for `/*`

### Issue: "Mixed content" warnings
**Solution:** All assets should load over HTTPS via CloudFront

---

## Deployment Checklist

### Initial Setup:
- [ ] Build application (`npm run build`)
- [ ] Create S3 bucket
- [ ] Enable static website hosting
- [ ] Set bucket policy (public read)
- [ ] Upload dist/ files to S3
- [ ] Test S3 endpoint
- [ ] Create CloudFront distribution
- [ ] Wait for CloudFront deployment
- [ ] Test CloudFront URL
- [ ] Request SSL certificate in ACM (us-east-1)
- [ ] Validate certificate via DNS
- [ ] Create Route 53 hosted zone
- [ ] Update nameservers at domain registrar
- [ ] Wait for DNS propagation
- [ ] Create Route 53 A records (alias to CloudFront)
- [ ] Update CloudFront with custom domain + SSL
- [ ] Test custom domain URLs
- [ ] Verify HTTPS works

### Future Updates:
- [ ] Run `npm run build`
- [ ] Upload to S3 (overwrite files)
- [ ] Create CloudFront invalidation
- [ ] Test live site

---

## Alternative: Automated Deployment Script

Create `deploy.sh` in project root:

```bash
#!/bin/bash

# Configuration
BUCKET_NAME="retrowire-app"
DISTRIBUTION_ID="YOUR_CLOUDFRONT_ID"  # Get from CloudFront console

echo "🔨 Building application..."
npm run build

echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Live at: https://retrowire.com"
```

Make executable:
```bash
chmod +x deploy.sh
```

Deploy with one command:
```bash
./deploy.sh
```

---

## Alternative: Using GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://retrowire-app/ --delete
        
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
            --paths "/*"
```

**Add these secrets in GitHub repo settings:**
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY  
- CLOUDFRONT_ID

Now every push to main branch automatically deploys!

---

## Custom Domain Configuration Summary

### Your Domain Registrar:
- **Nameservers:** Point to AWS Route 53 nameservers

### AWS Route 53:
- **Hosted Zone:** retrowire.com
- **A Record (root):** Alias → CloudFront
- **A Record (www):** Alias → CloudFront

### AWS CloudFront:
- **CNAMEs:** retrowire.com, www.retrowire.com
- **SSL Certificate:** ACM certificate for your domain

### AWS Certificate Manager:
- **Certificate:** For retrowire.com and www.retrowire.com
- **Validation:** DNS (via Route 53 or external DNS)

---

## Quick Reference Commands

### Build & Deploy:
```bash
npm run build                                    # Build production
aws s3 sync dist/ s3://retrowire-app/ --delete # Upload to S3
```

### CloudFront Invalidation:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### Check S3 Bucket Size:
```bash
aws s3 ls s3://retrowire-app/ --recursive --human-readable --summarize
```

---

## Security Best Practices

1. ✅ **Enable CloudFront:** Always use CloudFront (HTTPS, caching, DDoS protection)
2. ✅ **Use HTTPS:** Free SSL certificate from ACM
3. ✅ **Bucket Policy:** Only allow public read, not write
4. ✅ **IAM Users:** Create separate IAM user for deployments (not root)
5. ✅ **Access Keys:** Store in environment variables, never commit to Git

---

## Support & Resources

### AWS Free Tier Limits:
- **S3:** https://aws.amazon.com/s3/pricing/
- **CloudFront:** https://aws.amazon.com/cloudfront/pricing/
- **Route 53:** https://aws.amazon.com/route53/pricing/

### AWS Documentation:
- **S3 Static Hosting:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html
- **CloudFront:** https://docs.aws.amazon.com/cloudfront/
- **Route 53:** https://docs.aws.amazon.com/route53/

### Useful Tools:
- **AWS CLI:** https://aws.amazon.com/cli/
- **AWS Console:** https://console.aws.amazon.com

---

## Frequently Asked Questions

### Q: How long does DNS propagation take?
**A:** Usually 5 minutes to 24 hours, sometimes up to 48 hours.

### Q: Can I use a subdomain instead of root domain?
**A:** Yes! Use `app.retrowire.com` instead. Same process, just use subdomain in Route 53 records.

### Q: What if I exceed free tier limits?
**A:** AWS will email you. For a static site like RetroWire, you'd need LOTS of traffic (~20,000+ visitors/month).

### Q: How do I set up www redirect to non-www?
**A:** The current setup handles both. CloudFront serves both `retrowire.com` and `www.retrowire.com`.

### Q: Can I use my own SSL certificate?
**A:** AWS Certificate Manager provides free certificates. Recommended to use ACM.

### Q: How do I roll back a deployment?
**A:** Keep previous dist/ folder or re-deploy from Git history:
```bash
git checkout <previous-commit>
npm run build
aws s3 sync dist/ s3://retrowire-app/ --delete
```

---

## Next Steps After Deployment

1. ✅ Set up monitoring (CloudWatch Free Tier)
2. ✅ Configure CloudFront error pages
3. ✅ Set up automated backups of S3 bucket
4. ✅ Add domain to Google Search Console
5. ✅ Set up uptime monitoring (UptimeRobot free tier)
6. ✅ Configure alerts for AWS Free Tier usage

---

## Summary

You now have RetroWire deployed on AWS with:
- ✅ Fast global CDN (CloudFront)
- ✅ Reliable hosting (S3)
- ✅ Custom domain (Route 53)
- ✅ Free SSL certificate (HTTPS)
- ✅ ~$0.50/month cost on free tier

**Live URLs:**
- https://retrowire.com
- https://www.retrowire.com

**Deployment Time:** ~30-60 minutes (mostly waiting for DNS)

---

**Questions?** Refer to AWS documentation or check CloudWatch logs for errors.

**Happy Deploying! 🚀**

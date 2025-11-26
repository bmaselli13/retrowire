# Firebase Unauthorized Domain Error - Fix

## Problem
```
Firebase: Error (auth/unauthorized-domain)
```

This error occurs because your Netlify deployment domain is not authorized in Firebase Console.

## Solution

### Step 1: Find Your Netlify Domain
Your Netlify site URL will be something like:
- `https://your-site-name.netlify.app`
- Or your custom domain if you've set one up

### Step 2: Add Domains to Firebase Console

You need to add BOTH of your domains:
- **Netlify domain:** `golden-klepon-11b3f8.netlify.app`
- **Custom domain:** `retro-wire.com`
- **WWW subdomain (if applicable):** `www.retro-wire.com`

For each domain:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **retrowire-46077**
3. In the left sidebar, click **Authentication**
4. Click on the **Settings** tab (gear icon)
5. Scroll down to **Authorized domains** section
6. Click **Add domain**
7. Enter the domain (WITHOUT `https://`):
   - First, add: `golden-klepon-11b3f8.netlify.app`
   - Click **Add**
   - Then add: `retro-wire.com`
   - Click **Add**
   - Finally add: `www.retro-wire.com` (if you're using www)
   - Click **Add**

**IMPORTANT:** Enter ONLY the domain name, no protocol or slashes:
- ✅ Correct: `golden-klepon-11b3f8.netlify.app`
- ❌ Wrong: `https://golden-klepon-11b3f8.netlify.app`
- ❌ Wrong: `https://golden-klepon-11b3f8.netlify.app/`

### Step 3: Verify All Domains Are Added

After adding, you should see these domains in your authorized list:
- ✅ `localhost` (should already be there)
- ✅ `golden-klepon-11b3f8.netlify.app`
- ✅ `retro-wire.com`
- ✅ `www.retro-wire.com` (if you use www)

### Step 4: Wait and Test

- Changes are usually instant, but can take a few minutes
- Refresh your Netlify site and try Google sign-in again
- Clear your browser cache if the error persists

## Important Notes

- Firebase comes with `localhost` pre-authorized for development
- You must add each domain you deploy to (production, staging, etc.)
- Both `www.yourdomain.com` and `yourdomain.com` are separate entries if using custom domain
- Subdomains must be added individually

## After Adding Domain

Once you've added your Netlify domain to Firebase's authorized domains:
1. Refresh your deployed site
2. Try signing in with Google again
3. The error should be resolved

## Need Help?

If you're still having issues:
1. Double-check the domain exactly matches your Netlify URL
2. Make sure you didn't include `https://` or trailing slashes
3. Check browser console for any other errors
4. Verify you're testing on the correct Netlify URL

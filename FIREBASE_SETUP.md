# Firebase Authentication Setup Guide

This guide will walk you through setting up Firebase Authentication for RetroWire.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `RetroWire` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional for this project)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

## Step 2: Register Your Web App

1. In the Firebase Console, on the project overview page
2. Click the **Web icon** `</>` to add a web app
3. Enter app nickname: `RetroWire Web`
4. Check **"Also set up Firebase Hosting"** (optional)
5. Click **Register app**
6. You'll see your Firebase configuration object - **COPY THIS**
7. Click **Continue to console**

## Step 3: Enable Authentication Providers

### Enable Google Sign-In:
1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. Click the **Sign-in method** tab
4. Find **Google** in the list and click it
5. Toggle **Enable** to ON
6. Enter a **Project support email** (your email)
7. Click **Save**

### Enable Email/Password Sign-In:
1. Still in the **Sign-in method** tab
2. Find **Email/Password** and click it
3. Toggle **Enable** to ON (first option only, not "Email link")
4. Click **Save**

## Step 4: Configure Your App

1. Open `src/firebase/config.ts` in your project
2. Replace the placeholder values with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_FROM_FIREBASE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save the file

## Step 5: Add Authorized Domains (Important!)

1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add your Netlify domain: `your-site-name.netlify.app`
5. Click **Add**

**Note:** `localhost` is already authorized by default for development.

## Step 6: Configure OAuth Redirect (for Google Sign-In)

1. In Firebase Console → **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Ensure these are listed:
   - `localhost` (for local testing)
   - Your Netlify domain (e.g., `retrowire.netlify.app`)

## Step 7: Test Your Setup

1. Run the app locally: `npm run dev`
2. Navigate to landing page
3. Click "Get Started"
4. Try signing in with Google
5. Try creating account with email/password

## Security Best Practices

### Protect Your API Key:
Your Firebase config includes an API key. This is **safe to expose in client-side code** because:
- Firebase uses security rules to protect data
- The API key only identifies your project
- It doesn't grant access without authentication

However, you should:
1. Set up Firebase Security Rules (already done by Firebase)
2. Never commit your `.env` file if you use environment variables
3. Monitor authentication usage in Firebase Console

### Optional: Use Environment Variables

For extra security, you can use environment variables:

1. Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `src/firebase/config.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

3. Add `.env` to `.gitignore`

4. In Netlify, add environment variables:
   - Go to Site settings → Build & deploy → Environment
   - Add each variable

## What You Get

✅ **Google Sign-In** - One-click authentication with Google accounts
✅ **Email/Password** - Traditional account creation
✅ **User Management** - Firebase handles password reset, email verification
✅ **Security** - Built-in protection against common attacks
✅ **Scalability** - Free tier: 10,000 authentications/month

## Monitoring Usage

1. Firebase Console → **Authentication** → **Users** tab
2. See all registered users
3. View sign-in methods used
4. Monitor authentication activity

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Authorized domains in Firebase Console

### "Failed to sign in with Google"
- Check that Google provider is enabled
- Verify authorized domains include your Netlify domain

### "Module not found: firebase"
- Run `npm install` to ensure Firebase SDK is installed

## Next Steps

1. Complete Firebase setup above
2. Update `src/firebase/config.ts` with your credentials
3. Deploy to Netlify
4. Test sign-in flow
5. Monitor users in Firebase Console

## Free Tier Limits

- **Authentication**: 10,000 phone authentications/month
- **Users**: Unlimited users
- **Storage**: 1 GB
- **Bandwidth**: 10 GB/month

These limits are very generous for a starting SaaS!

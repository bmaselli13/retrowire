# Email Pre-fill Bug Fix

## Problem Identified

From the screenshot, the email field in the AuthModal is **EMPTY** despite the user entering an email on the landing page. This is a critical UX issue.

## Root Cause

**React State Update Race Condition**

The current code in `src/LandingPage.tsx` has this sequence:
```typescript
setPrefillEmail(email);  // State update is async
setShowAuthModal(true);  // Modal renders immediately
```

The modal renders BEFORE the `prefillEmail` state has propagated, so the AuthModal receives an empty string.

## Solution

Add `useEffect` to ensure the modal only shows after the email state is set:

### Step 1: Add useEffect import
```typescript
import { useState, useEffect } from 'react';
```

### Step 2: Add useEffect hooks after state declarations
```typescript
// Fix race condition: Only show modal after email is set
useEffect(() => {
  if (prefillEmail && !showAuthModal) {
    setShowAuthModal(true);
  }
}, [prefillEmail, showAuthModal]);

// Reset email when modal closes
useEffect(() => {
  if (!showAuthModal) {
    setPrefillEmail('');
  }
}, [showAuthModal]);
```

### Step 3: Update handleGetStarted
```typescript
// Set email - useEffect will show modal after state updates
setPrefillEmail(email);
// Remove: setShowAuthModal(true);
```

## Testing Steps

1. Go to landing page
2. Enter email in signup form
3. Click "Get Started"
4. **Verify:** Email appears pre-filled in auth modal
5. **Verify:** Modal defaults to "Create Account" tab
6. Test Google and email/password signup
7. **Verify:** Redirect to /app after successful auth

## Additional Gaps Found

### GAP 5: No First-Time User Onboarding
- **Issue:** After signup, empty canvas with no guidance
- **Fix:** Create welcome modal with quick start guide

### GAP 6: No Trial Period Tracking
- **Issue:** Can't enforce 7-day trial
- **Fix:** Add Firestore fields for trial tracking

## Files to Modify

1. ✅ `src/LandingPage.tsx` - Email pre-fill fix (documented above)
2. 📝 `src/components/WelcomeModal.tsx` - Create onboarding modal
3. 📝 `src/firebase/AuthContext.tsx` - Add trial tracking logic
4. 📝 `src/App.tsx` - Show welcome modal for new users

## Next Steps

1. Apply the code changes documented above
2. Commit with message: "Fix email pre-fill race condition bug"
3. Push to production
4. Test live site to verify email pre-fills correctly
5. Create onboarding modal for first-time users
6. Implement trial period tracking in Firestore

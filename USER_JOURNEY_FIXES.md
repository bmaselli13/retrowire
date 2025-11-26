# User Journey Analysis & Fixes

## Product Manager Analysis - Critical Gaps Identified

### ❌ GAP 1: Email Pre-fill Not Working
**Issue:** User enters email on landing page, but it doesn't appear in the auth modal
**Impact:** Poor UX - users have to type email twice
**Status:** Bug identified in screenshot

### ✅ Gap 2: CTA Consistency (FIXED)
**Issue:** All buttons now check auth state correctly
**Status:** Working correctly

### ✅ Gap 3: Route Protection (FIXED)  
**Issue:** /app route is now protected
**Status:** Working correctly

### ✅ Gap 4: Signup First (FIXED)
**Issue:** Modal defaults to "Create Account"
**Status:** Working correctly (confirmed in screenshot)

### ❌ GAP 5: First-Time User Experience
**Issue:** After signup, user lands on empty canvas with no guidance
**Impact:** High bounce rate for new users
**Status:** Needs onboarding modal

### ❌ GAP 6: Trial Period Tracking
**Issue:** No mechanism to track 7-day trial
**Impact:** Can't enforce trial limits
**Status:** Needs Firestore implementation

## Senior Engineer - Technical Fixes

### FIX 1: Email Pre-fill (CRITICAL BUG)
The issue is a React state update race condition. The modal renders before `prefillEmail` state updates.

**Solution:** Use useEffect to ensure state is set before showing modal

### FIX 2: First-Time User Onboarding
Add a welcome modal that appears after first signup

### FIX 3: Trial Tracking
Add Firestore fields: `trialStartDate`, `trialEndDate`, `isTrialActive`

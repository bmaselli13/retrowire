# RetroWire User Journey Analysis

## Product Manager Perspective: Current User Journey

### Ideal User Journey:
1. **Discovery** → User lands on homepage
2. **Interest** → User learns about features/benefits
3. **Decision** → User decides to try the product
4. **Signup** → User creates an account (frictionless)
5. **Onboarding** → User understands how to use the app
6. **Activation** → User creates first project
7. **Retention** → User returns to continue work
8. **Conversion** → User subscribes after trial

### Current Implementation - GAPS IDENTIFIED:

❌ **GAP 1: Duplicate Email Entry**
- User enters email on landing page
- Then must enter email again in auth modal
- **Fix**: Pre-fill email in auth modal from landing page input

❌ **GAP 2: Inconsistent CTAs**
- "Launch App" button → Goes to /app (no auth check)
- "Get Started" button → Shows auth modal
- "Start 7-Day Free Trial" → Goes to /app (no auth check)
- **Fix**: All CTAs should trigger authentication flow

❌ **GAP 3: No Route Protection**
- Users can access /app without being authenticated
- No data persistence or user association
- Projects don't save to user accounts
- **Fix**: Protect /app route, require authentication

❌ **GAP 4: Poor First-Time User Experience**
- After signup, user lands on empty canvas with no guidance
- No welcome message or tutorial
- Unclear what to do next
- **Fix**: Add onboarding modal or quick start guide

❌ **GAP 5: No Trial Period Tracking**
- Authentication works, but no trial period logic
- No way to track when trial ends
- No prompt for subscription after 7 days
- **Fix**: Add trial tracking in Firebase/database

❌ **GAP 6: Confusing "Launch App" in Header**
- Suggests app works without account
- Bypasses the signup funnel
- **Fix**: Change to "Sign In" when not authenticated

❌ **GAP 7: Auth Modal Defaults to Login**
- New users see "Sign In" first
- Should default to "Sign Up" for better conversion
- **Fix**: Make signup the default state

## Senior Software Engineer Perspective: Technical Gaps

### Critical Issues:

🔴 **CRITICAL: No Authentication Gate on /app**
```typescript
// Current: Anyone can access /app
const isAppRoute = window.location.pathname === '/app';
const CurrentPage = isAppRoute ? App : LandingPage;

// Should be: Check authentication first
```

🔴 **CRITICAL: No Data Persistence**
```typescript
// Current: Projects stored in browser localStorage only
// Problem: Data lost on different device, not tied to user

// Should: Store projects in Firebase with user ID
```

🟡 **MEDIUM: Email Not Passed to Auth Modal**
```typescript
// Current: Email from landing page is discarded
// Should: Pass email to AuthModal, pre-fill signup form
```

🟡 **MEDIUM: Poor Modal UX for New Users**
```typescript
// Current: Modal defaults to "Login" (isLogin = true)
// Should: Default to "Sign Up" for better conversion
```

🟢 **LOW: CTA Button Inconsistency**
```typescript
// Current: Some buttons trigger auth, some don't
// Should: Unified flow for all CTAs
```

## Recommended Fixes (Priority Order):

### 1. **IMMEDIATE: Protect /app Route** 
Add authentication check before showing app

### 2. **IMMEDIATE: Unify CTA Flow**
All buttons should show auth modal when user not logged in

### 3. **HIGH: Pre-fill Email**
Pass landing page email to auth modal

### 4. **HIGH: Default to Signup**
Modal should show "Create Account" by default

### 5. **HIGH: First-Time User Onboarding**
Welcome modal after first login

### 6. **MEDIUM: Replace "Launch App" with "Sign In"**
Header button should reflect auth state

### 7. **FUTURE: Add Trial Tracking**
Database schema for trial periods and subscriptions

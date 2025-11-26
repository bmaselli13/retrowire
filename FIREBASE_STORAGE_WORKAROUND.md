# Firebase Storage Workaround - Using Free Spark Plan

## Issue
Firebase Storage requires upgrading to the Blaze (pay-as-you-go) billing plan. To keep RetroWire on the free Spark plan, we'll store images as base64 strings directly in Firestore.

## Solution: Base64 Storage in Firestore

### Advantages
- ✅ No billing required
- ✅ Simpler implementation
- ✅ Still works on free tier
- ✅ Good for small images (avatars, thumbnails)

### Limitations
- ⚠️ Each document limited to 1MB (plenty for compressed images)
- ⚠️ Counts toward Firestore storage quota (1GB free)
- ⚠️ Slightly slower than Storage for large images

### Image Size Limits (Base64 in Firestore)
- **Avatars**: 200x200px, compressed → ~15-30KB base64
- **Thumbnails**: 400x300px, compressed → ~40-80KB base64
- **Total per user profile**: < 100KB
- **Total per project**: < 100KB
- **Free tier supports**: ~10,000 projects or ~10,000 users easily

## Implementation Changes

### Modified Services

#### userService.ts
- ✅ Gravatar URLs (no storage needed)
- ✅ Custom avatars as base64 in user profile
- ❌ Remove Firebase Storage upload functions

#### projectService.ts
- ✅ Thumbnails as base64 strings in project documents
- ❌ Remove Firebase Storage thumbnail functions

#### storageService.ts
- ✅ Keep image resizing/compression functions
- ✅ Convert to base64 instead of uploading
- ❌ Remove Firebase Storage operations

### Updated Avatar Flow
```
1. User uploads image file
2. Resize to 200x200px
3. Compress to JPEG (90% quality)
4. Convert to base64 string
5. Store in Firestore user profile
6. Display using data URI
```

### Updated Thumbnail Flow
```
1. Capture canvas as image
2. Resize to 400x300px
3. Compress to JPEG (85% quality)
4. Convert to base64 string
5. Store in project document
6. Display using data URI
```

## If You Want to Use Storage Later

If you decide to upgrade to Blaze plan:
1. Uncomment Storage imports in services
2. Switch from base64 to Storage URLs
3. The code structure supports both approaches
4. Migration would be automatic on upload

## Free Tier Capacity

With base64 approach:
- **1GB Firestore storage** = ~10,000 projects with thumbnails
- **50,000 reads/day** = plenty for normal use
- **20,000 writes/day** = plenty for auto-save

This is more than sufficient for a maker tool! 🛠️

## Alternative: Upgrade to Blaze (Optional)

**Cost:** Pay-as-you-go (very cheap for small apps)
- First 5GB Storage: **FREE**
- Then: $0.026/GB/month
- Network: $0.12/GB

**For typical use:** < $1/month

But our base64 solution works great on free tier! ✨

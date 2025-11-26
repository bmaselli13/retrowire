# Firebase Security Rules Setup

## Firestore Security Rules

You need to configure these security rules in your Firebase Console to protect user data.

### Steps to Apply Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **retro-wire-19f9f**
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab
5. Replace the existing rules with the rules below
6. Click **Publish**

### Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // User profiles
    match /users/{userId} {
      // Users can only read their own profile
      allow read: if isOwner(userId);
      
      // Users can only write to their own profile
      allow write: if isOwner(userId);
    }
    
    // Projects
    match /projects/{projectId} {
      // Can read if:
      // - You own the project
      // - Project is public
      // - Project is shared with your email
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        resource.data.isPublic == true ||
        (request.auth.token.email != null && 
         request.auth.token.email in resource.data.sharedWith)
      );
      
      // Can create if authenticated and you're setting yourself as owner
      allow create: if isAuthenticated() &&
        request.resource.data.userId == request.auth.uid;
      
      // Can update/delete only if you own the project
      allow update, delete: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Firebase Storage Rules

You also need to configure storage rules for avatar uploads.

### Steps to Apply Rules:

1. In Firebase Console, select your project
2. Click **Storage** in the left sidebar
3. Click the **Rules** tab
4. Replace the existing rules with the rules below
5. Click **Publish**

### Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the file
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper to check if file is an image
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // Helper to check file size (max 5MB)
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024;
    }
    
    // User avatars
    match /avatars/{userId}/{fileName} {
      // Anyone can read avatars (for displaying in shared projects)
      allow read: if true;
      
      // Only owner can upload/delete their avatar
      allow write: if isOwner(userId) && isImage() && isValidSize();
    }
    
    // Project thumbnails
    match /projects/{userId}/{projectId}/{fileName} {
      // Anyone can read thumbnails (for shared/public projects)
      allow read: if true;
      
      // Only project owner can upload/delete thumbnails
      allow write: if isOwner(userId) && isImage() && isValidSize();
    }
  }
}
```

## Index Creation (Important!)

For efficient queries, you need to create composite indexes in Firestore.

### Required Indexes:

1. **Projects Collection**
   - Fields: `userId` (Ascending), `updatedAt` (Descending)
   - Collection: `projects`
   
2. **Projects Collection (Shared)**
   - Fields: `sharedWith` (Array), `updatedAt` (Descending)
   - Collection: `projects`

### Auto-Create Indexes:

Firebase will automatically prompt you to create these indexes when you first run queries that need them. When you see the error in the console, click the provided link to auto-create the index.

Alternatively, create them manually:
1. Go to Firebase Console → Firestore Database
2. Click **Indexes** tab
3. Click **Create Index**
4. Add the fields as specified above

## Testing the Rules

After applying the rules, test them by:

1. Creating a new user account
2. Creating a project
3. Trying to access another user's private project (should fail)
4. Making a project public and accessing it without ownership (should succeed)
5. Sharing a project with an email and accessing it (should succeed)

## Security Notes

✅ **What these rules protect:**
- Users can only access their own profile data
- Users can only create/edit/delete their own projects
- Private projects are only accessible by owner
- Shared projects are accessible by owner + shared users
- Public projects are accessible by everyone
- Avatar/thumbnail uploads are size-limited (5MB max)

❌ **Limitations:**
- Anyone can read public avatars and thumbnails (by design, for sharing)
- Email-based sharing requires exact email match
- No rate limiting (handled by Firebase quota system)

## Next Steps

After applying these rules:
1. Test creating a user profile
2. Test creating a project
3. Test sharing a project
4. Verify security is working as expected

The app will automatically use these rules - no code changes needed!

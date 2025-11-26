# Phase 5B: Account Settings & Cloud Storage - Implementation Plan

## Project Requirements (from user)
- **Project Limit**: 2 projects for free users
- **Data Export**: ZIP with images (canvas snapshots)
- **Avatar Upload**: Both Gravatar and custom upload support
- **Theme**: Dark and light theme support
- **Project Sharing**: Yes, implement sharing functionality

## Implementation Phases

### Phase 5B.1: Firestore Database Setup (1-2 hours)
**Priority: HIGH - Foundation for everything else**

#### Database Schema
```typescript
// Collection: users/{uid}
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string; // Gravatar or custom
  customAvatarURL?: string; // Custom uploaded avatar
  useGravatar: boolean; // Toggle between Gravatar/custom
  preferences: {
    theme: 'dark' | 'light';
    defaultVoltage: '5V' | '12V';
    autoSave: boolean;
    autoSaveInterval: number; // seconds
  };
  subscription: {
    tier: 'free' | 'pro';
    projectLimit: number; // 2 for free, unlimited for pro
  };
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// Collection: projects/{projectId}
interface Project {
  id: string;
  userId: string; // Owner
  name: string;
  description?: string;
  nodes: Node[]; // ReactFlow nodes
  edges: Edge[]; // ReactFlow edges
  preferredVoltage: '5V' | '12V';
  thumbnail?: string; // base64 canvas snapshot
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Sharing
  isPublic: boolean;
  sharedWith: string[]; // Array of user emails
  shareLink?: string; // Public share link
}
```

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects
    match /projects/{projectId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        resource.data.isPublic ||
        request.auth.token.email in resource.data.sharedWith
      );
      
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
        
      allow update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

**Files to create:**
- `src/firebase/firestore.ts` - Firestore initialization and helpers
- `src/firebase/userService.ts` - User profile CRUD operations
- `src/firebase/projectService.ts` - Project CRUD operations

---

### Phase 5B.2: User Profile Service (1 hour)
**Priority: HIGH - Needed for user data**

Create user profile management service.

**Features:**
- Create user profile on first login
- Update profile (name, avatar, preferences)
- Gravatar integration
- Custom avatar upload to Firebase Storage
- Theme preference management

**Files to create:**
- `src/firebase/userService.ts`
- `src/firebase/storageService.ts` (for avatar uploads)
- `src/types/user.ts` (TypeScript interfaces)

---

### Phase 5B.3: Project Management Service (2 hours)
**Priority: HIGH - Core functionality**

Create project CRUD operations and migration from localStorage.

**Features:**
- List user's projects
- Create new project
- Load project
- Save project (auto-save with debounce)
- Delete project
- Rename project
- Update thumbnail
- Check project limit (2 for free)

**Migration Strategy:**
- Detect existing localStorage project on first cloud login
- Prompt user: "We found an existing project. Would you like to save it to the cloud?"
- Migrate project to Firestore
- Keep localStorage as backup/offline cache

**Files to create:**
- `src/firebase/projectService.ts`
- `src/hooks/useProjects.ts` (React hook)
- `src/utils/migration.ts` (localStorage → Firestore)

---

### Phase 5B.4: Theme System (1 hour)
**Priority: MEDIUM**

Implement dark/light theme switching.

**Implementation:**
- Use Tailwind CSS dark mode classes
- Store theme preference in Firestore user profile
- Add theme toggle in settings
- Update all components to support both themes

**Files to modify:**
- `tailwind.config.js` - Enable dark mode
- `src/App.tsx` - Add theme provider
- `src/contexts/ThemeContext.tsx` (new)
- Update all component styles for theme support

---

### Phase 5B.5: Projects Dashboard UI (3 hours)
**Priority: HIGH - Main user interface**

Create the project management interface.

**Features:**
- Grid/list view of projects
- Project cards with thumbnails
- Create new project button
- Search/filter projects
- Sort by: name, date created, date modified
- Quick actions: open, rename, duplicate, delete
- Project limit indicator (e.g., "2/2 projects")

**Components to create:**
- `src/pages/ProjectsDashboard.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectList.tsx`
- `src/components/CreateProjectModal.tsx`

**Routing:**
```typescript
/              → Landing page
/projects      → Projects Dashboard (requires auth)
/editor/:id    → Project Editor (current App)
```

---

### Phase 5B.6: Account Settings Modal (2 hours)
**Priority: MEDIUM**

Create comprehensive settings interface.

**Sections:**
1. **Profile**
   - Display name
   - Email (read-only)
   - Avatar management (Gravatar toggle + custom upload)
   - Preview

2. **Preferences**
   - Theme (Dark/Light toggle)
   - Default voltage (5V/12V)
   - Auto-save toggle
   - Auto-save interval

3. **Subscription**
   - Current tier (Free/Pro)
   - Project limit
   - Upgrade button (future)

4. **Data & Privacy**
   - Export all projects (ZIP)
   - Delete account (with confirmation)

5. **About**
   - App version
   - Credits
   - Documentation links

**Components to create:**
- `src/components/SettingsModal.tsx`
- `src/components/settings/ProfileSettings.tsx`
- `src/components/settings/PreferencesSettings.tsx`
- `src/components/settings/DataSettings.tsx`

---

### Phase 5B.7: Project Sharing (2 hours)
**Priority: MEDIUM**

Implement project sharing functionality.

**Features:**
1. **Share with specific users**
   - Enter email addresses
   - Shared users can view (not edit)
   - Manage shared users list

2. **Public link sharing**
   - Generate public share link
   - Anyone with link can view
   - Toggle public/private

3. **Share modal UI**
   - Share button in project header
   - Modal with sharing options
   - Copy share link button

**Components to create:**
- `src/components/ShareProjectModal.tsx`
- `src/pages/SharedProject.tsx` (view-only mode)
- Update projectService.ts with sharing functions

---

### Phase 5B.8: Data Export (1 hour)
**Priority: LOW**

Implement ZIP export of all projects.

**Export Contents:**
- `project-name/`
  - `data.json` (nodes, edges, metadata)
  - `thumbnail.png` (if available)
  - `README.md` (project info)

**Implementation:**
- Use JSZip library
- Generate canvas snapshots for thumbnails
- Include metadata (created date, modified date, etc.)
- Download as `retrowire-export-YYYY-MM-DD.zip`

**Files to create:**
- `src/utils/exportProjects.ts`

---

### Phase 5B.9: Auto-Save System (1 hour)
**Priority: HIGH**

Implement intelligent auto-save to Firestore.

**Features:**
- Debounced save (3 seconds default)
- Save indicator (saving/saved/error)
- Conflict resolution (last-write-wins with timestamp)
- Optimistic UI updates
- Retry on failure

**Files to create:**
- `src/hooks/useAutoSave.ts`
- Update `src/store.ts` with cloud save logic

---

## Implementation Order

### Week 1: Foundation
1. ✅ Phase 5A: Bug Fixes (COMPLETE)
2. Phase 5B.1: Firestore Database Setup
3. Phase 5B.2: User Profile Service
4. Phase 5B.3: Project Management Service

### Week 2: Core Features
5. Phase 5B.5: Projects Dashboard UI
6. Phase 5B.9: Auto-Save System
7. Phase 5B.6: Account Settings Modal

### Week 3: Polish
8. Phase 5B.4: Theme System
9. Phase 5B.7: Project Sharing
10. Phase 5B.8: Data Export

---

## Technical Considerations

### Firestore Quotas (Free Tier)
- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Storage**: 1 GB
- **Bandwidth**: 10 GB/month

### Optimization Strategies
1. Use Firestore offline persistence
2. Cache project list locally
3. Only fetch project data when opening
4. Batch writes for auto-save
5. Compress thumbnails (<50KB each)

### Avatar Upload Strategy
1. Check if user wants Gravatar (based on email)
2. If custom upload:
   - Resize to 200x200px
   - Compress to <100KB
   - Upload to Firebase Storage: `avatars/{uid}/avatar.jpg`
   - Store download URL in user profile

### Theme Implementation
```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class-based dark mode
  // ...
}

// Usage in components
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

## File Structure (New)

```
src/
├── firebase/
│   ├── config.ts (existing)
│   ├── AuthContext.tsx (existing)
│   ├── firestore.ts (new)
│   ├── userService.ts (new)
│   ├── projectService.ts (new)
│   └── storageService.ts (new)
├── contexts/
│   └── ThemeContext.tsx (new)
├── pages/
│   ├── ProjectsDashboard.tsx (new)
│   ├── ProjectEditor.tsx (current App.tsx)
│   └── SharedProject.tsx (new)
├── components/
│   ├── ProjectCard.tsx (new)
│   ├── ProjectList.tsx (new)
│   ├── CreateProjectModal.tsx (new)
│   ├── SettingsModal.tsx (new)
│   ├── ShareProjectModal.tsx (new)
│   └── settings/
│       ├── ProfileSettings.tsx (new)
│       ├── PreferencesSettings.tsx (new)
│       └── DataSettings.tsx (new)
├── hooks/
│   ├── useProjects.ts (new)
│   └── useAutoSave.ts (new)
├── utils/
│   ├── migration.ts (new)
│   └── exportProjects.ts (new)
└── types/
    └── user.ts (new)
```

---

## Dependencies to Install

```json
{
  "dependencies": {
    "jszip": "^3.10.1",
    "react-router-dom": "^6.20.0",
    "react-dropzone": "^14.2.3",
    "md5": "^2.3.0"
  },
  "devDependencies": {
    "@types/jszip": "^3.4.1",
    "@types/md5": "^2.3.5"
  }
}
```

---

## Next Steps

Ready to begin Phase 5B.1: Firestore Database Setup?

This will involve:
1. Installing necessary dependencies
2. Creating Firestore configuration
3. Setting up security rules
4. Creating user and project service files

Let me know when you're ready to proceed!

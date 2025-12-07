# NextBB Feature & Priority Roadmap

## Current NextBB Features

### ✅ Implemented
1. **User Authentication**
   - Login/Signup via Supabase Auth
   - User profiles (username, avatar, role)
   - Basic role system (admin/user)

2. **Forum Structure**
   - Categories with sort ordering
   - Forums within categories with sort ordering
   - Admin can create/delete categories and forums

3. **Threads**
   - Create threads with title and content
   - Thread pinning (schema support, display only)
   - Thread locking (schema support, display only)
   - View count tracking (increments on thread view, works for all users)
   - Thread listing with author and timestamps

4. **Posts/Replies**
   - Create replies to threads
   - Post author information display
   - Post timestamps
   - Post editing flag in schema (not functional)

5. **UI/UX**
   - Modern responsive design with Tailwind CSS
   - Dark mode support (via next-themes)
   - Breadcrumb navigation
   - Avatar display

---

## Missing Features

### 🔴 **PRIORITY 1: Core Functionality** (Essential for basic forum operation)

#### 1.1 Post & Thread Editing/Deletion
- **Status**: Schema has `isEdited` flag but no functionality
- **Missing**:
  - Edit own posts (with edit timestamp)
  - Delete own posts
  - Edit thread titles
  - Delete own threads
  - Edit/delete permissions based on time limits
- **Why Critical**: Users need to correct mistakes, remove content
- **Effort**: Medium

#### 1.2 View Count Tracking ✅ **COMPLETED**
- **Status**: ✅ Implemented - View count increments automatically on thread page load
- **Implementation**: Server-side increment using atomic SQL update, works for all users (authenticated and anonymous)
- **Why Critical**: Basic engagement metric
- **Effort**: Low

#### 1.3 Thread Updated Timestamp
- **Status**: Schema has `updatedAt` but not updated on new replies
- **Missing**: Update `updatedAt` when new reply is posted (currently commented out)
- **Why Critical**: Shows which threads have recent activity
- **Effort**: Low

#### 1.4 Forum Statistics Display
- **Status**: Placeholders exist in code
- **Missing**:
  - Thread count per forum
  - Post count per forum
  - Last post author and timestamp
  - Last post thread link
- **Why Critical**: Users need to see activity levels
- **Effort**: Medium (requires optimized queries or denormalized counts)

#### 1.5 Thread Statistics Display
- **Status**: Post count not shown
- **Missing**:
  - Post count per thread (shown in forum listing)
  - Last reply author and timestamp
- **Why Critical**: Shows thread activity
- **Effort**: Medium

#### 1.6 Moderation Tools (Admin/Moderator)
- **Status**: Schema supports locking/pinning, but no UI
- **Missing**:
  - Lock/unlock threads
  - Pin/unpin threads
  - Delete posts (moderator/admin)
  - Delete threads (moderator/admin)
  - Move threads between forums
  - Split/merge threads
- **Why Critical**: Essential for forum management
- **Effort**: High

#### 1.7 Search Functionality
- **Status**: Not implemented
- **Missing**:
  - Basic search (thread titles, post content)
  - Search by author
  - Search by date range
  - Advanced filters
- **Why Critical**: Users need to find content
- **Effort**: High

---

### 🟠 **PRIORITY 2: User Experience** (Significantly improves usability)

#### 2.1 Rich Text Formatting
- **Status**: Plain text only
- **Missing**:
  - BBCode support (bold, italic, links, images)
  - Or Markdown support
  - Code blocks with syntax highlighting
  - Quote functionality
  - Emoticons/emojis
- **Why Important**: Makes posts more readable and expressive
- **Effort**: High

#### 2.2 Post Pagination
- **Status**: All posts load at once
- **Missing**:
  - Pagination for threads with many posts
  - Posts per page setting
  - Jump to page functionality
- **Why Important**: Performance and usability for long threads
- **Effort**: Medium

#### 2.3 User Profile Pages
- **Status**: Basic user info in header only
- **Missing**:
  - Dedicated user profile pages (`/user/[id]`)
  - User statistics (post count, thread count, join date)
  - User's recent posts/threads
  - User signature
  - User preferences/settings page
- **Why Important**: Community building and user identity
- **Effort**: Medium

#### 2.4 Thread Locking UI
- **Status**: Schema supports it, but no way to lock threads
- **Missing**: UI for admins/moderators to lock/unlock threads
- **Why Important**: Prevents spam and manages discussions
- **Effort**: Low

#### 2.5 Thread Pinning UI
- **Status**: Schema supports it, but no way to pin threads
- **Missing**: UI for admins/moderators to pin/unpin threads
- **Why Important**: Highlights important threads
- **Effort**: Low

#### 2.6 Last Post Information
- **Status**: Not displayed
- **Missing**:
  - Last post author on forum listing
  - Last post timestamp on forum listing
  - Last post author on thread listing
  - Last post timestamp on thread listing
- **Why Important**: Shows recent activity at a glance
- **Effort**: Medium (requires query optimization)

---

### 🟡 **PRIORITY 3: Community Features** (Enhances engagement)

#### 3.1 Private Messaging System
- **Status**: Not implemented
- **Missing**:
  - Send/receive private messages
  - Inbox/outbox
  - Message notifications
  - Block users
- **Why Important**: Enables private communication
- **Effort**: High

#### 3.2 Notifications System
- **Status**: Not implemented
- **Missing**:
  - Email notifications for replies
  - In-app notifications
  - Notification preferences
  - Subscribe to threads
- **Why Important**: Keeps users engaged
- **Effort**: High

#### 3.3 User Groups & Permissions
- **Status**: Basic admin/user roles only
- **Missing**:
  - Multiple user groups (moderator, VIP, banned, etc.)
  - Granular permissions per forum
  - Permission inheritance
  - Group-based access control
- **Why Important**: Flexible moderation and access control
- **Effort**: High

#### 3.4 Attachments/File Uploads
- **Status**: Not implemented
- **Missing**:
  - Image uploads
  - File attachments
  - File size limits
  - File type restrictions
  - Image previews
- **Why Important**: Users want to share media
- **Effort**: High

#### 3.5 Polls
- **Status**: Not implemented
- **Missing**:
  - Create polls in threads
  - Multiple choice options
  - Vote tracking
  - Poll results display
- **Why Important**: Engagement and feedback
- **Effort**: Medium

---

### 🟢 **PRIORITY 4: Advanced Features** (Nice to have)

#### 4.1 Spam Prevention
- **Status**: Not implemented
- **Missing**:
  - CAPTCHA on registration/posting
  - Rate limiting
  - Spam detection
  - Post moderation queue
- **Why Important**: Prevents abuse
- **Effort**: Medium

#### 4.2 User Reputation/Karma
- **Status**: Not implemented
- **Missing**:
  - Upvote/downvote posts
  - User reputation score
  - Reputation display
- **Why Important**: Quality control and gamification
- **Effort**: Medium

#### 4.3 Bookmarks/Favorites
- **Status**: Not implemented
- **Missing**:
  - Bookmark threads
  - Favorite forums
  - Quick access to bookmarks
- **Why Important**: User convenience
- **Effort**: Low

#### 4.4 Activity Feed
- **Status**: Not implemented
- **Missing**:
  - Recent posts page
  - Recent threads page
  - Unread posts indicator
  - "What's new" functionality
- **Why Important**: Helps users find new content
- **Effort**: Medium

#### 4.5 Online Users
- **Status**: Not implemented
- **Missing**:
  - Who's online list
  - Online/offline indicators
  - Active users count
- **Why Important**: Shows community activity
- **Effort**: Medium

#### 4.6 Report Posts
- **Status**: Not implemented
- **Missing**:
  - Report inappropriate content
  - Report queue for moderators
  - Report reasons
- **Why Important**: Community moderation
- **Effort**: Medium

#### 4.7 Multi-language Support
- **Status**: Not implemented
- **Missing**:
  - Language selection
  - Translation files
  - RTL support
- **Why Important**: International accessibility
- **Effort**: High

#### 4.8 RSS/ATOM Feeds
- **Status**: Not implemented
- **Missing**:
  - RSS feed for forums
  - RSS feed for threads
  - ATOM feed support
- **Why Important**: Content syndication
- **Effort**: Low

#### 4.9 Advanced Search
- **Status**: Not implemented (basic search in Priority 1)
- **Missing**:
  - Search within specific forums
  - Search by date range
  - Search by post count
  - Search filters
- **Why Important**: Power users need advanced search
- **Effort**: Medium

#### 4.10 User Banning System
- **Status**: Not implemented
- **Missing**:
  - Ban users
  - Temporary/permanent bans
  - Ban reasons
  - Ban history
- **Why Important**: Moderation tool
- **Effort**: Medium

---

## Recommended Implementation Order

### Phase 1: Foundation (Weeks 1-2)
1. ✅ **COMPLETED** View count tracking (increment on thread view)
2. ⏳ Thread updated timestamp (update on new reply)
3. ⏳ Forum statistics (thread/post counts, last post info)
4. ⏳ Thread statistics (post count, last reply info)
5. ⏳ Basic moderation UI (lock/unlock, pin/unpin threads)

### Phase 2: Content Management (Weeks 3-4)
6. ✅ Post editing (own posts, with time limit)
7. ✅ Post deletion (own posts)
8. ✅ Thread editing/deletion (own threads)
9. ✅ Moderator delete posts/threads
10. ✅ Move threads between forums

### Phase 3: Discovery (Weeks 5-6)
11. ✅ Basic search functionality
12. ✅ User profile pages with statistics
13. ✅ Recent posts/activity feed
14. ✅ Pagination for posts

### Phase 4: Rich Content (Weeks 7-8)
15. ✅ BBCode or Markdown support
16. ✅ Quote functionality
17. ✅ Code blocks with syntax highlighting
18. ✅ Image uploads/attachments

### Phase 5: Engagement (Weeks 9-10)
19. ✅ Notifications system (email + in-app)
20. ✅ Thread subscriptions
21. ✅ Private messaging
22. ✅ User groups and permissions

### Phase 6: Advanced Features (Weeks 11+)
23. ✅ Polls
24. ✅ Spam prevention (CAPTCHA, rate limiting)
25. ✅ User reputation/karma
26. ✅ Bookmarks
27. ✅ Report posts
28. ✅ Online users
29. ✅ Advanced search
30. ✅ RSS feeds

---

## Quick Wins (Low Effort, High Impact)

1. ✅ **COMPLETED** View count increment - Implemented on thread page
2. **Thread updated timestamp** - Uncomment and fix the update
3. **Lock/Pin UI** - Add buttons for admins on thread pages
4. **Post count display** - Add to thread listings
5. **Last post info** - Add to forum/thread listings
6. **User profile link** - Make usernames clickable to profile pages

---

## Technical Considerations

### Database Optimizations Needed
- Add indexes on frequently queried fields (forumId, threadId, authorId, createdAt)
- Consider denormalizing post/thread counts for performance
- Add composite indexes for common query patterns

### Schema Additions Needed
- `notifications` table
- `private_messages` table
- `attachments` table
- `polls` and `poll_votes` tables
- `user_groups` and `permissions` tables
- `reports` table
- `bookmarks` table
- `subscriptions` table (for thread subscriptions)

### Infrastructure Considerations
- File storage for attachments (Supabase Storage or S3)
- Email service for notifications (Supabase or SendGrid)
- Real-time updates (Supabase Realtime for notifications)
- Search indexing (PostgreSQL full-text search or external service)

---

## Summary

**Current State**: NextBB has a solid foundation with basic forum functionality. View count tracking has been implemented. Many essential features are still missing that users expect from modern forum software.

**Gap Analysis**: Approximately 29+ major features remaining, with core functionality gaps in editing, moderation, search, and statistics.

**Recommended Focus**: Prioritize Phase 1-3 features first, as they provide the essential functionality users need. Phase 4-6 can be added based on community feedback and usage patterns.

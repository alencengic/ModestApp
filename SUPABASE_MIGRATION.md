# Supabase Migration Guide

This document explains how to migrate from the local SQLite database to Supabase.

## Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

### 2. Set Environment Variables
Update your `.env` file with your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Schema
Copy the contents of `supabase-schema.sql` and run it in your Supabase SQL editor to create all tables, indexes, and Row Level Security policies.

### 4. Enable Email Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your email templates
3. Set up any additional auth providers if needed

## Migration Process

The app now uses Supabase functions located in `/storage/supabase/` instead of the local SQLite functions in `/storage/`.

### Updated Components

All database operations now:
- Require user authentication
- Include user_id in all queries
- Use Row Level Security for data isolation
- Support real-time updates (can be enabled)

### Key Changes

1. **Authentication Required**: All database operations now require a logged-in user
2. **User Isolation**: Each user can only access their own data
3. **Real-time Ready**: Supabase supports real-time subscriptions for live updates
4. **Cloud Storage**: Data is stored in the cloud, accessible from any device

### Testing

1. Create a new account through the app
2. Add some data (food intakes, mood entries, etc.)
3. Log out and log back in to verify data persistence
4. Create another account to verify data isolation

### Rollback Plan

If you need to rollback to SQLite:
1. Keep the original SQLite files in `/storage/`
2. Update import statements in components
3. Remove authentication requirements
4. Comment out Supabase configuration

## Features Added

- **User Authentication**: Email/password login with password reset
- **Multi-user Support**: Each user has their own isolated data
- **Cloud Sync**: Data syncs across devices automatically
- **Better Security**: Row Level Security ensures data privacy
- **Scalability**: Handles multiple users efficiently

## Next Steps

- Add real-time subscriptions for live data updates
- Implement offline support with local caching
- Add social authentication providers
- Set up data backup and export features
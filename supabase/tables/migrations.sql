-- MIGRATION: 20260407 - Profiles and Feature Enhancements

-- 1. EXTEND USERS FOR PROFILES
ALTER TABLE next_auth.users 
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS years_of_experience integer,
ADD COLUMN IF NOT EXISTS experience_level text,
ADD COLUMN IF NOT EXISTS profile_title text,
ADD COLUMN IF NOT EXISTS role text;

-- 2. ENHANCE NOTIFICATIONS
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS link text,
ADD COLUMN IF NOT EXISTS sender_id uuid REFERENCES next_auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 3. ENHANCE PROJECTS
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS full_description text;

-- 4. UPDATE RLS FOR NOTIFICATIONS (IF NEEDED)
-- Already handled by 'all' policy in notifications.sql, but ensuring sender_id is accessible
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

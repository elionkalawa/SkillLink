-- NOTIFICATION TYPE ENUM
-- Note: 'create type' will error if it already exists. 
-- For migrations, we usually skip if not absolute necessary or check for existence.
-- create type notification_type as enum ('invite', 'approval', 'message', 'project-update');

-- NOTIFICATIONS TABLE
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references next_auth.users(id) on delete cascade,
  type notification_type,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- RLS POLICIES
alter table notifications enable row level security;

-- Policy: Users can only view their own notifications
create policy "Users can view their own notifications"
on notifications for select
using (user_id = auth.uid());

-- Policy: Users can delete their own notifications (e.g., dismiss)
create policy "Users can update/delete their own notifications"
on notifications for all
using (user_id = auth.uid());

-- ENABLE REALTIME
alter publication supabase_realtime add table notifications;

-- FOLLOWS TABLE
create table if not exists follows (
  follower_id uuid not null references next_auth.users(id) on delete cascade,
  following_id uuid not null references next_auth.users(id) on delete cascade,
  is_allowed boolean default false, -- For the "allow in message section"
  created_at timestamp with time zone default now(),
  primary key (follower_id, following_id),
  constraint follower_following_not_same check (follower_id <> following_id)
);

-- RLS POLICIES
alter table follows enable row level security;

-- Policy: Users can see who they follow and who follows them
create policy "Users can view follows they are part of"
on follows for select
using (follower_id = auth.uid() or following_id = auth.uid());

-- Policy: Anyone can view follow relationships (publicly visible counts)
-- Note: 'create or replace' isn't supported for policies, we use standard create
drop policy if exists "Allow public read access to follows" on follows;
create policy "Allow public read access to follows"
on follows for select
using (true);

-- Policy: Users can follow others
create policy "Users can follow others"
on follows for insert
with check (follower_id = auth.uid());

-- Policy: Users can unfollow others
create policy "Users can unfollow"
on follows for delete
using (follower_id = auth.uid());

-- Policy: Users can allow their followers to message them
create policy "Users can update their own received follows (allow messaging)"
on follows for update
using (following_id = auth.uid())
with check (following_id = auth.uid());

-- ENABLE REALTIME
alter publication supabase_realtime add table follows;

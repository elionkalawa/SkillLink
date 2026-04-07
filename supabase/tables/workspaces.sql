-- WORKSPACES TABLE
create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  chat_id uuid references chats(id) on delete set null,
  name text not null,
  description text,
  avatar_url text,
  cover_url text,
  settings jsonb default '{}'::jsonb,
  pinned_links jsonb default '[]'::jsonb,
  status text default 'active',
  created_at timestamp with time zone default now(),
  unique(project_id)
);

-- RLS POLICIES
alter table workspaces enable row level security;

-- Policy: Members can view their workspaces
create policy "Users can view workspaces they are members of"
on workspaces for select
using (
  exists (
    select 1 from project_members 
    where project_id = workspaces.project_id 
    and user_id = auth.uid() 
    and status = 'approved'
  )
  or
  exists (
    select 1 from projects
    where id = workspaces.project_id
    and owner_id = auth.uid()
  )
);

-- Policy: Owners can manage workspaces
create policy "Owners can manage their workspaces"
on workspaces for all
using (
  exists (
    select 1 from projects
    where id = workspaces.project_id
    and owner_id = auth.uid()
  )
);

-- ENABLE REALTIME
alter publication supabase_realtime add table workspaces;

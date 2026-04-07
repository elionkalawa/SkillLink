-- PROJECT STATUS ENUM
-- Avoid re-creating if it already exists
-- create type project_status as enum ('open', 'in-progress', 'completed');

-- PROJECTS TABLE
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  owner_id uuid not null references next_auth.users(id) on delete cascade,
  category text, 
  skills_required text[] default '{}',
  tags text[] default '{}',
  max_team_size integer not null default 1,
  status project_status default 'open',
  organization text,
  deadline timestamp with time zone,
  image_url text,
  full_description text,
  created_at timestamp with time zone default now()
);

-- PROJECT MEMBERS TABLE
create table if not exists project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references next_auth.users(id) on delete cascade,
  role member_role default 'member',
  status member_status default 'pending',
  joined_at timestamp with time zone default now(),
  unique(project_id, user_id)
);

-- RLS POLICIES
alter table projects enable row level security;
alter table project_members enable row level security;

-- Policy: Everyone can view "open" projects (Marketplace)
create policy "Anyone can view open projects"
on projects for select
using (status = 'open' or owner_id = auth.uid());

-- Policy: Only owner can update/delete project
create policy "Owners can manage their projects"
on projects for all
using (owner_id = auth.uid());

-- Project Members Policies
create policy "Users can view memberships of their own projects"
on project_members for select
using (
  user_id = auth.uid() 
  or 
  exists (
    select 1 from projects 
    where id = project_members.project_id 
    and owner_id = auth.uid()
  )
);

-- Policy: Users can apply to join projects (insert member)
create policy "Users can apply to projects"
on project_members for insert
with check (user_id = auth.uid() and role = 'member' and status = 'pending');

-- PROJECT STATUS ENUM
create type project_status as enum ('open', 'in-progress', 'completed');

-- PROJECTS TABLE
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  owner_id uuid not null references users(id) on delete cascade,
  skills_required text[] default '{}',
  max_team_size integer not null default 1,
  status project_status default 'open',
  created_at timestamp with time zone default now()
);

-- PROJECT MEMBER ROLE ENUM
create type member_role as enum ('owner', 'member', 'guest');
-- PROJECT MEMBER STATUS ENUM
create type member_status as enum ('pending', 'approved', 'rejected');

-- PROJECT MEMBERS TABLE
create table if not exists project_members (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role member_role default 'member',
  status member_status default 'pending',
  joined_at timestamp with time zone default now(),
  unique(project_id, user_id)
);

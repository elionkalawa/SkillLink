-- NOTIFICATION TYPE ENUM
create type notification_type as enum ('invite', 'approval', 'message', 'project-update');

-- NOTIFICATIONS TABLE
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  type notification_type,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

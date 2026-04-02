create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_message text,
  name text, -- For group names
  is_group boolean default false
);

-- CHAT PARTICIPANTS (Junction Table)
create table if not exists chat_participants (
  chat_id uuid references chats(id) on delete cascade,
  user_id uuid references next_auth.users(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key (chat_id, user_id)
);

-- MESSAGES TABLE
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  sender_id uuid references next_auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  is_read boolean default false
);

-- ROW LEVEL SECURITY (RLS) policies

-- Enable RLS
alter table chats enable row level security;
alter table chat_participants enable row level security;
alter table messages enable row level security;

-- Policy: Users can see chats they are in
create policy "Users can view chats they participate in"
on chats for select
using (
  exists (
    select 1 from chat_participants
    where chat_id = chats.id
    and user_id = auth.uid()
  )
);

-- Policy: Users can view messages in chats they are part of
create policy "Users can view messages in their chats"
on messages for select
using (
  exists (
    select 1 from chat_participants
    where chat_id = messages.chat_id
    and user_id = auth.uid()
  )
);

-- Policy: Users can view messages to chats they are part of
create policy "Users can send messages to their chats"
on messages for insert
with check (
  exists (
    select 1 from chat_participants
    where chat_id = messages.chat_id
    and user_id = auth.uid()
  )
  and sender_id = auth.uid()
);

-- CHAT PARTICIPANTS POLICIES
create policy "Users can view their own participant records"
on chat_participants for select
using (
  user_id = auth.uid() 
  or 
  exists (
    select 1 from chat_participants as cp2
    where cp2.chat_id = chat_participants.chat_id
    and cp2.user_id = auth.uid()
  )
);

-- Enable Realtime
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table chats;

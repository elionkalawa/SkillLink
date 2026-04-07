-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CREATE SCHEMA next_auth
create schema if not exists next_auth;

-- USERS TABLE
create table if not exists next_auth.users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique,
  "emailVerified" timestamp with time zone,
  image text,
  password_hash text,
  username text unique,
  bio text,
  skills text[] default '{}',
  github_url text,
  linkedin_url text,
  portfolio_url text,
  location text,
  years_of_experience integer,
  experience_level text,
  profile_title text,
  role text,
  created_at timestamp with time zone default now()
);

-- ACCOUNTS TABLE (NextAuth specific)
create table if not exists next_auth.accounts (
  id uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references next_auth.users(id) on delete cascade on update cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique(provider, "providerAccountId")
);

-- SESSIONS TABLE (NextAuth specific)
create table if not exists next_auth.sessions (
  id uuid primary key default uuid_generate_v4(),
  "sessionToken" text not null unique,
  "userId" uuid not null references next_auth.users(id) on delete cascade on update cascade,
  expires timestamp with time zone not null
);

-- VERIFICATION TOKENS TABLE (NextAuth specific)
create table if not exists next_auth.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp with time zone not null,
  unique(identifier, token)
);

-- ROW LEVEL SECURITY (RLS) policies

-- Enable RLS
alter table next_auth.users enable row level security;
alter table next_auth.accounts enable row level security;
alter table next_auth.sessions enable row level security;
alter table next_auth.verification_tokens enable row level security;

-- USERS policies
create policy "Users can view all profiles"
on next_auth.users for select
using (true);

create policy "Users can update their own profile"
on next_auth.users for update
using (auth.uid() = id);

-- ACCOUNTS policies
create policy "Users can view their own accounts"
on next_auth.accounts for select
using (auth.uid() = "userId");

-- SESSIONS policies
create policy "Users can view their own sessions"
on next_auth.sessions for select
using (auth.uid() = "userId");

-- ENABLE REALTIME
alter publication supabase_realtime add table next_auth.users;

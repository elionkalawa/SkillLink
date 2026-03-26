-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique,
  "emailVerified" timestamp with time zone,
  image text,
  password_hash text,
  username text unique,
  bio text,
  skills text[] default '{}',
  created_at timestamp with time zone default now()
);

-- ACCOUNTS TABLE (NextAuth specific)
create table if not exists accounts (
  id uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references users(id) on delete cascade on update cascade,
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
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  "sessionToken" text not null unique,
  "userId" uuid not null references users(id) on delete cascade on update cascade,
  expires timestamp with time zone not null
);

-- VERIFICATION TOKENS TABLE (NextAuth specific)
create table if not exists verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp with time zone not null,
  unique(identifier, token)
);

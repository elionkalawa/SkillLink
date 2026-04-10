-- Migration: Add read_at for read receipts and last_seen for presence tracking
-- Run this in your Supabase SQL Editor

-- Add read_at timestamp to messages for blue tick (read receipt) logic
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- Add last_seen to users for online/offline presence tracking
ALTER TABLE next_auth.users ADD COLUMN IF NOT EXISTS last_seen timestamptz;

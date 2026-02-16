-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  bungie_membership_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_users_bungie_membership_id ON users(bungie_membership_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

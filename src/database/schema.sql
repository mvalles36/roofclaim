-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'sales_manager', 'project_manager', 'sales_rep', 'customer_success_rep', 'contractor')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select their own data
CREATE POLICY select_own_user ON users FOR SELECT USING (auth.uid() = auth_id);

-- Create a policy that allows users to update their own data (except role and is_active)
CREATE POLICY update_own_user ON users FOR UPDATE
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id AND NEW.role = OLD.role AND NEW.is_active = OLD.is_active);

-- Create a policy that allows admins to select all users
CREATE POLICY admin_select_all_users ON users FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Create a policy that allows admins to update all users
CREATE POLICY admin_update_all_users ON users FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Create a policy that allows admins to insert new users
CREATE POLICY admin_insert_users ON users FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;

-- Create function to update users
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users
CREATE TRIGGER update_users_timestamp_trigger
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_users_timestamp();

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(auth_uid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM users WHERE auth_id = auth_uid;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;

-- Existing tables for the sales process remain unchanged

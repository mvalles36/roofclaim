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

-- Create sales_process table
CREATE TABLE IF NOT EXISTS sales_process (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create stages table
CREATE TABLE IF NOT EXISTS stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_id UUID REFERENCES sales_process(id),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create steps table
CREATE TABLE IF NOT EXISTS steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id UUID REFERENCES stages(id),
  name TEXT NOT NULL,
  description TEXT,
  probability INTEGER,
  wait_time INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY select_own_user ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY update_own_user ON users FOR UPDATE
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id AND NEW.role = OLD.role AND NEW.is_active = OLD.is_active);
CREATE POLICY admin_select_all_users ON users FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));
CREATE POLICY admin_update_all_users ON users FOR UPDATE
USING (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));
CREATE POLICY admin_insert_users ON users FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin'));

-- Create policies for sales_process, stages, and steps tables
CREATE POLICY select_all_sales_process ON sales_process FOR SELECT USING (true);
CREATE POLICY select_all_stages ON stages FOR SELECT USING (true);
CREATE POLICY select_all_steps ON steps FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT ON sales_process, stages, steps TO authenticated;

-- Create function to update users timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_sales_process_timestamp
BEFORE UPDATE ON sales_process
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stages_timestamp
BEFORE UPDATE ON stages
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_steps_timestamp
BEFORE UPDATE ON steps
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

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

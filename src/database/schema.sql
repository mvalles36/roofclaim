-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'sales', 'manager', 'supplement_specialist', 'crew_team_leader')),
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

-- New tables for the sales process

CREATE TABLE Stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT,
    min_probability INT,
    max_probability INT
);

CREATE TABLE Steps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    probability INT,
    wait_time INT,
    stage_id INT,
    FOREIGN KEY (stage_id) REFERENCES Stages(id) ON DELETE CASCADE
);

CREATE TABLE Activities (
    id SERIAL PRIMARY KEY,
    step_id INT,
    activity TEXT,
    FOREIGN KEY (step_id) REFERENCES Steps(id) ON DELETE CASCADE
);

CREATE TABLE Tools (
    id SERIAL PRIMARY KEY,
    step_id INT,
    tool TEXT,
    FOREIGN KEY (step_id) REFERENCES Steps(id) ON DELETE CASCADE
);

CREATE TABLE ExpectedOutcomes (
    id SERIAL PRIMARY KEY,
    step_id INT,
    outcome TEXT,
    FOREIGN KEY (step_id) REFERENCES Steps(id) ON DELETE CASCADE
);

CREATE TABLE Challenges (
    id SERIAL PRIMARY KEY,
    step_id INT,
    challenge TEXT,
    FOREIGN KEY (step_id) REFERENCES Steps(id) ON DELETE CASCADE
);

-- Create policies for the new tables
CREATE POLICY select_stages ON Stages FOR SELECT USING (true);
CREATE POLICY select_steps ON Steps FOR SELECT USING (true);
CREATE POLICY select_activities ON Activities FOR SELECT USING (true);
CREATE POLICY select_tools ON Tools FOR SELECT USING (true);
CREATE POLICY select_expected_outcomes ON ExpectedOutcomes FOR SELECT USING (true);
CREATE POLICY select_challenges ON Challenges FOR SELECT USING (true);

-- Grant necessary permissions for the new tables
GRANT SELECT ON Stages, Steps, Activities, Tools, ExpectedOutcomes, Challenges TO authenticated;

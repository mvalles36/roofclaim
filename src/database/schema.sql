-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'employee', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users
CREATE POLICY users_policy ON users FOR ALL USING (
  (auth.uid() = id) OR 
  (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
);

-- Function for admin to add a user with a specific role
CREATE OR REPLACE FUNCTION add_user_with_role(
  new_user_id UUID,
  new_user_email TEXT,
  new_user_name TEXT,
  new_user_role TEXT
)
RETURNS UUID AS $$
BEGIN
  -- Check if the role is valid
  IF new_user_role NOT IN ('customer', 'employee', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be customer, employee, or admin';
  END IF;

  -- Insert the new user
  INSERT INTO users (id, email, name, role)
  VALUES (new_user_id, new_user_email, new_user_name, new_user_role);

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION add_user_with_role TO authenticated;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
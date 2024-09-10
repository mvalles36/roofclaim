-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'employee', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inspections Table
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  address TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Installations Table
CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  address TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drone Images Table
CREATE TABLE drone_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID REFERENCES inspections(id),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inspection Reports Table
CREATE TABLE inspection_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID REFERENCES inspections(id),
  overall_condition TEXT,
  damage_annotations JSONB,
  roof_measurements_url TEXT,
  insurance_policy_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_inspections_user_id ON inspections(user_id);
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_installations_user_id ON installations(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_drone_images_inspection_id ON drone_images(inspection_id);
CREATE INDEX idx_inspection_reports_inspection_id ON inspection_reports(inspection_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can only see and modify their own data
CREATE POLICY users_policy ON users FOR ALL USING (id = auth.uid() OR role = 'admin');

-- Users can only see and modify their own inspections
CREATE POLICY inspections_policy ON inspections FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin')));

-- Users can only see and modify their own claims
CREATE POLICY claims_policy ON claims FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin')));

-- Users can only see and modify their own installations
CREATE POLICY installations_policy ON installations FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin')));

-- Users can only see their own notifications
CREATE POLICY notifications_policy ON notifications FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin')));

-- Only allow access to drone images related to user's inspections
CREATE POLICY drone_images_policy ON drone_images FOR ALL USING (
  inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin'))
);

-- Only allow access to inspection reports related to user's inspections
CREATE POLICY inspection_reports_policy ON inspection_reports FOR ALL USING (
  inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('employee', 'admin'))
);

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inspections_modtime
    BEFORE UPDATE ON inspections
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_claims_modtime
    BEFORE UPDATE ON claims
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_installations_modtime
    BEFORE UPDATE ON installations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inspection_reports_modtime
    BEFORE UPDATE ON inspection_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function for admin to add a user with a specific role
CREATE OR REPLACE FUNCTION add_user_with_role(
  admin_id UUID,
  new_user_email TEXT,
  new_user_name TEXT,
  new_user_role TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if the function caller is an admin
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can add users with roles';
  END IF;

  -- Check if the role is valid
  IF new_user_role NOT IN ('customer', 'employee', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be customer, employee, or admin';
  END IF;

  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();

  -- Insert the new user
  INSERT INTO users (id, email, name, role)
  VALUES (new_user_id, new_user_email, new_user_name, new_user_role);

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION add_user_with_role TO authenticated;
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('sales', 'sales manager', 'project manager', 'admin', 'sales development representative', 'customer success manager', 'contractor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(255),
    contact_status VARCHAR(50) NOT NULL CHECK (contact_status IN ('Prospect', 'Qualified Lead', 'Customer', 'Lost', 'Unqualified', 'Bad Data')),
    sales_rep_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    job_portal_url VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('Sales Agreement', 'Invoice', 'Proposal')),
    document_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stages Table
CREATE TABLE IF NOT EXISTS stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Steps Table
CREATE TABLE IF NOT EXISTS steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID REFERENCES stages(id),
    name VARCHAR(255) NOT NULL,
    expected_outcome VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    step_id UUID REFERENCES steps(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY select_own_user ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY update_own_user ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY select_contacts ON contacts FOR SELECT USING (true);
CREATE POLICY insert_contacts ON contacts FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'admin')));
CREATE POLICY update_contacts ON contacts FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'admin')));

CREATE POLICY select_jobs ON jobs FOR SELECT USING (true);
CREATE POLICY insert_jobs ON jobs FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'project manager', 'admin')));
CREATE POLICY update_jobs ON jobs FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'project manager', 'admin')));

CREATE POLICY select_documents ON documents FOR SELECT USING (true);
CREATE POLICY insert_documents ON documents FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'admin')));
CREATE POLICY update_documents ON documents FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'admin')));

CREATE POLICY select_stages ON stages FOR SELECT USING (true);
CREATE POLICY insert_stages ON stages FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin')));
CREATE POLICY update_stages ON stages FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin')));

CREATE POLICY select_steps ON steps FOR SELECT USING (true);
CREATE POLICY insert_steps ON steps FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin')));
CREATE POLICY update_steps ON steps FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin')));

CREATE POLICY select_activities ON activities FOR SELECT USING (true);
CREATE POLICY insert_activities ON activities FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'admin')));
CREATE POLICY update_activities ON activities FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('sales', 'sales manager', 'admin')));

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON users, contacts, jobs, documents, stages, steps, activities TO authenticated;

-- Create function to update timestamp
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

CREATE TRIGGER update_contacts_timestamp
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_jobs_timestamp
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_documents_timestamp
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stages_timestamp
BEFORE UPDATE ON stages
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_steps_timestamp
BEFORE UPDATE ON steps
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_activities_timestamp
BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

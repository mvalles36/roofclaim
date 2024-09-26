-- Existing schema code...

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policy for knowledge_base table
CREATE POLICY admin_knowledge_base ON knowledge_base FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON knowledge_base TO authenticated;

-- Create trigger for timestamp updates
CREATE TRIGGER update_knowledge_base_timestamp
BEFORE UPDATE ON knowledge_base
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

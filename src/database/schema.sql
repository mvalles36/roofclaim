-- Create inspection_reports table
CREATE TABLE IF NOT EXISTS inspection_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id),
  status TEXT CHECK (status IN ('In Progress', 'Completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inspection_report_images table
CREATE TABLE IF NOT EXISTS inspection_report_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES inspection_reports(id),
  image_url TEXT NOT NULL,
  annotations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update inspection_reports
CREATE OR REPLACE FUNCTION update_inspection_report()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inspection_reports
CREATE TRIGGER update_inspection_report_trigger
BEFORE UPDATE ON inspection_reports
FOR EACH ROW EXECUTE FUNCTION update_inspection_report();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON inspection_reports TO authenticated;
GRANT SELECT, INSERT ON inspection_report_images TO authenticated;

-- Add RLS policies
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_report_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inspection reports they have access to"
  ON inspection_reports FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'sales', 'sales_manager', 'supplement_specialist')
    ) OR
    contact_id IN (
      SELECT id FROM contacts WHERE assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can insert inspection reports"
  ON inspection_reports FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('admin', 'sales', 'sales_manager'))
  );

CREATE POLICY "Users can update inspection reports they have access to"
  ON inspection_reports FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'sales', 'sales_manager', 'supplement_specialist')
    ) OR
    contact_id IN (
      SELECT id FROM contacts WHERE assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can view inspection report images they have access to"
  ON inspection_report_images FOR SELECT
  USING (
    report_id IN (
      SELECT id FROM inspection_reports WHERE
        auth.uid() IN (
          SELECT user_id FROM user_roles WHERE role IN ('admin', 'sales', 'sales_manager', 'supplement_specialist')
        ) OR
        contact_id IN (
          SELECT id FROM contacts WHERE assigned_to = auth.uid()
        )
    )
  );

CREATE POLICY "Users can insert inspection report images"
  ON inspection_report_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('admin', 'sales', 'sales_manager'))
  );

-- Function to get inspection report KPIs
CREATE OR REPLACE FUNCTION get_inspection_report_kpis()
RETURNS TABLE (
  completion_rate NUMERIC,
  avg_cycle_duration NUMERIC,
  customer_satisfaction NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (COUNT(*) FILTER (WHERE status = 'Completed')::NUMERIC / COUNT(*)::NUMERIC) * 100 AS completion_rate,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) AS avg_cycle_duration,
    4.2 AS customer_satisfaction -- Placeholder, replace with actual calculation
  FROM inspection_reports;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_inspection_report_kpis TO authenticated;

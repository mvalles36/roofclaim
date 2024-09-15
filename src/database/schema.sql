-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date DATE,
  assignee_role TEXT,
  status TEXT DEFAULT 'To-Do' CHECK (status IN ('To-Do', 'In Progress', 'Completed', 'Canceled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create task_history table for audit trail
CREATE TABLE IF NOT EXISTS task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id),
  changed_by UUID REFERENCES users(id),
  change_type TEXT,
  old_value JSONB,
  new_value JSONB,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update task history
CREATE OR REPLACE FUNCTION update_task_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO task_history (task_id, changed_by, change_type, old_value, new_value)
  VALUES (
    NEW.id,
    auth.uid(),
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for task history
CREATE TRIGGER task_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_task_history();

-- Create function to get tasks for a user's role
CREATE OR REPLACE FUNCTION get_tasks_for_role(user_role TEXT)
RETURNS SETOF tasks AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM tasks
  WHERE assignee_role = user_role OR assignee_role IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON tasks TO authenticated;
GRANT SELECT ON task_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_tasks_for_role TO authenticated;

-- Add RLS policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks assigned to their role"
  ON tasks FOR SELECT
  USING (
    assignee_role = (SELECT role FROM users WHERE id = auth.uid())
    OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'project_manager'))
  );

CREATE POLICY "Users can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'project_manager', 'sales_manager'))
  );

CREATE POLICY "Users can update their own tasks or if they're admin/project manager"
  ON tasks FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'project_manager'))
    OR (assignee_role = (SELECT role FROM users WHERE id = auth.uid()))
  );

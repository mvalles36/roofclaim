-- Existing schema code...

-- Update the tasks table
ALTER TABLE tasks
ADD COLUMN priority VARCHAR(10) NOT NULL DEFAULT 'medium',
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'not_started',
ADD COLUMN contact_id UUID REFERENCES contacts(id),
ADD COLUMN sequence_id UUID REFERENCES sequences(id);

-- Create an index for faster querying
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_contact_id ON tasks(contact_id);
CREATE INDEX idx_tasks_sequence_id ON tasks(sequence_id);

-- Update or create the function to get tasks for a user
CREATE OR REPLACE FUNCTION get_user_tasks(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  due_date TIMESTAMP,
  priority VARCHAR(10),
  status VARCHAR(20),
  contact_id UUID,
  sequence_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.contact_id, t.sequence_id
  FROM tasks t
  WHERE t.user_id = p_user_id
  ORDER BY 
    CASE t.priority
      WHEN 'high' THEN 1
      WHEN 'medium' THEN 2
      WHEN 'low' THEN 3
      ELSE 4
    END,
    t.due_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get task statistics for a user or team
CREATE OR REPLACE FUNCTION get_task_statistics(p_user_id UUID, p_is_manager BOOLEAN)
RETURNS TABLE (
  total_tasks BIGINT,
  completed_tasks BIGINT,
  in_progress_tasks BIGINT,
  not_started_tasks BIGINT,
  overdue_tasks BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS total_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
    COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_tasks,
    COUNT(*) FILTER (WHERE status = 'not_started') AS not_started_tasks,
    COUNT(*) FILTER (WHERE status != 'completed' AND due_date < CURRENT_TIMESTAMP) AS overdue_tasks
  FROM tasks t
  WHERE
    CASE
      WHEN p_is_manager THEN TRUE
      ELSE t.user_id = p_user_id
    END;
END;
$$ LANGUAGE plpgsql;

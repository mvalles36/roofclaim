CREATE TABLE website_visitors (
  id BIGSERIAL PRIMARY KEY,
  visitor_id UUID NOT NULL,
  page TEXT NOT NULL,
  time_on_page INTEGER NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on visitor_id for faster queries
CREATE INDEX idx_website_visitors_visitor_id ON website_visitors(visitor_id);

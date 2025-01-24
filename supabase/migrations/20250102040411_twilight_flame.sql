/*
  # Add Job Application Notifications

  1. New Tables
    - notifications
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - type (text)
      - message (text)
      - read (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on notifications table
    - Add policies for reading own notifications
*/

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles NOT NULL,
  type text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add trigger to create notification when application is created
CREATE OR REPLACE FUNCTION handle_new_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for employer
  INSERT INTO notifications (user_id, type, message)
  SELECT 
    jobs.employer_id,
    'new_application',
    'A worker has applied for your job: ' || jobs.title
  FROM jobs
  WHERE jobs.id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_application
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_application();

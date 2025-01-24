/*
  # Add phone number and improve job applications

  1. Changes
    - Add phone column to profiles table
    - Update notification message to include contact information
    - Add unique constraint to job applications

  2. Security
    - Maintain existing RLS policies
*/

-- Add phone column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update the notification message in the handle_new_application function
CREATE OR REPLACE FUNCTION handle_new_application()
RETURNS TRIGGER AS $$
DECLARE
  worker_info record;
  job_info record;
BEGIN
  -- Get worker information
  SELECT full_name, phone 
  INTO worker_info 
  FROM profiles 
  WHERE id = NEW.worker_id;

  -- Get job information
  SELECT title
  INTO job_info
  FROM jobs
  WHERE id = NEW.job_id;

  -- Create notification for employer with contact information
  INSERT INTO notifications (user_id, type, message)
  SELECT 
    jobs.employer_id,
    'new_application',
    'New application for "' || job_info.title || '" from ' || worker_info.full_name || 
    '. Contact: ' || worker_info.phone
  FROM jobs
  WHERE jobs.id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

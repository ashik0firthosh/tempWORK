/*
  # Make notification message nullable
  
  1. Changes
    - Make the message column in notifications table nullable
    - Update the handle_new_application function to handle null messages
*/

-- Make message column nullable
ALTER TABLE notifications ALTER COLUMN message DROP NOT NULL;

-- Update the function to handle null messages
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
    COALESCE(
      NEW.message,
      'New application for "' || job_info.title || '" from ' || worker_info.full_name || 
      CASE 
        WHEN worker_info.phone IS NOT NULL THEN '. Contact: ' || worker_info.phone
        ELSE ''
      END
    )
  FROM jobs
  WHERE jobs.id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

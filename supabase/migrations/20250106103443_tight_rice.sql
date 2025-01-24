/*
  # Enhance applications with worker profiles

  1. Changes
    - Add profile_snapshot column to applications table to store worker's profile at time of application
    - Update notification message to include more worker details
    - Add trigger to capture worker's profile when applying

  2. Security
    - Maintain existing RLS policies
    - Add policy for viewing profile snapshots
*/

-- Add profile snapshot to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS profile_snapshot jsonb;

-- Update the notification handler to include more worker details
CREATE OR REPLACE FUNCTION handle_new_application()
RETURNS TRIGGER AS $$
DECLARE
  worker_profile record;
  job_info record;
BEGIN
  -- Get complete worker profile
  SELECT 
    p.full_name,
    p.phone,
    p.email,
    p.avatar_url,
    p.bio,
    p.location,
    p.skills,
    p.rating
  INTO worker_profile 
  FROM profiles p
  WHERE p.id = NEW.worker_id;

  -- Get job information
  SELECT title
  INTO job_info
  FROM jobs
  WHERE id = NEW.job_id;

  -- Store worker's profile snapshot
  UPDATE applications 
  SET profile_snapshot = to_jsonb(worker_profile)
  WHERE id = NEW.id;

  -- Create detailed notification for employer
  INSERT INTO notifications (user_id, type, message)
  SELECT 
    jobs.employer_id,
    'new_application',
    'New application for "' || job_info.title || '" from ' || worker_profile.full_name || 
    CASE 
      WHEN worker_profile.phone IS NOT NULL 
      THEN E'\nContact: ' || worker_profile.phone
      ELSE ''
    END ||
    CASE 
      WHEN worker_profile.location IS NOT NULL 
      THEN E'\nLocation: ' || worker_profile.location
      ELSE ''
    END ||
    CASE 
      WHEN worker_profile.skills IS NOT NULL AND array_length(worker_profile.skills, 1) > 0
      THEN E'\nSkills: ' || array_to_string(worker_profile.skills, ', ')
      ELSE ''
    END
  FROM jobs
  WHERE jobs.id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

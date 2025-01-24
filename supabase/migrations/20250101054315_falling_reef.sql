/*
  # Fix Jobs Table Policies

  1. Changes
    - Update jobs table policies to fix permission issues
    - Add proper RLS policies for job creation and reading
    - Ensure employers can manage their own jobs
    - Allow workers to view available jobs

  2. Security
    - Enable RLS on jobs table
    - Add specific policies for different user roles
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can read open jobs" ON jobs;
DROP POLICY IF EXISTS "Employers can create jobs" ON jobs;

-- Create new policies with proper permissions
CREATE POLICY "Users can read jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    -- Anyone can read open jobs
    status = 'open'
    -- Or jobs they're involved with
    OR employer_id = auth.uid()
    OR worker_id = auth.uid()
  );

CREATE POLICY "Employers can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Verify the user is an employer
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'employer'
    )
    -- Ensure they can only set themselves as employer
    AND employer_id = auth.uid()
  );

CREATE POLICY "Employers can update own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete own jobs"
  ON jobs
  FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

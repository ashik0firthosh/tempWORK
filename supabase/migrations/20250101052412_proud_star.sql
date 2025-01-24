/*
  # Update profile policies

  1. Changes
    - Add policy for users to insert their own profile
    - Fix profile creation during signup

  2. Security
    - Enable RLS on profiles table
    - Add policy for profile creation
*/

-- Allow users to create their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update the existing select policy to be more restrictive
DROP POLICY "Users can read all profiles" ON profiles;
CREATE POLICY "Users can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Users can read their own profile
    auth.uid() = id
    -- Or profiles of employers/workers they interact with
    OR EXISTS (
      SELECT 1 FROM jobs
      WHERE (jobs.employer_id = profiles.id AND jobs.worker_id = auth.uid())
      OR (jobs.worker_id = profiles.id AND jobs.employer_id = auth.uid())
    )
  );

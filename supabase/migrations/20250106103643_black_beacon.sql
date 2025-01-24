/*
  # Create avatar storage bucket and policies

  1. Changes
    - Create public storage bucket for avatars
    - Set up policies for avatar uploads and access
*/

-- Create bucket for avatars if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Policy to allow authenticated users to upload their own avatar
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
  CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
END $$;

-- Policy to allow authenticated users to update their own avatar
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
  CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
END $$;

-- Policy to allow public access to avatars
DO $$
BEGIN
  DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
  CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');
END $$;

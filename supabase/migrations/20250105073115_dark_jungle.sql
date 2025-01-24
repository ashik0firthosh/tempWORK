/*
  # Add avatar support to profiles
  
  1. Changes
    - Add avatar_url column to profiles table
    - Add bio column for user description
    - Add location column for user location
*/

-- Add new columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text;

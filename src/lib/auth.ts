import { supabase } from './supabase';
import type { User, Profile } from '../types';

// Password validation
function validatePassword(password: string): boolean {
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPassword.test(password);
}

// Convert Supabase profile to our User type
function profileToUser(profile: Profile): User {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    phone: profile.phone,
    role: profile.role
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) return null;
  return profileToUser(profile);
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  if (!data.user) throw new Error('Login failed');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) throw new Error('Profile not found');
  return profileToUser(profile);
}

export async function signUp(data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'worker' | 'employer';
}): Promise<User> {
  if (!validatePassword(data.password)) {
    throw new Error('Password is too weak. Please use at least 8 characters with uppercase, lowercase, and numbers.');
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });
  
  if (authError) throw authError;
  if (!authData.user) throw new Error('Signup failed');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      role: data.role
    })
    .select()
    .single();

  if (profileError) {
    // Clean up auth user if profile creation fails
    await supabase.auth.signOut();
    throw new Error('Failed to create profile');
  }

  if (!profile) throw new Error('Profile creation failed');
  return profileToUser(profile);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

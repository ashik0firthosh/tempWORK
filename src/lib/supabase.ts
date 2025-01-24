import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Supabase client configuration
let supabaseUrl: string;
let supabaseAnonKey: string;

if (typeof window === 'undefined') { // Check if we're in a Node.js environment (build time)
  supabaseUrl = process.env.VITE_SUPABASE_URL!;
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
} else { // We're in the browser (runtime)
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qxtlslmhoefbeqeqedbd.supabase.co';
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dGxzbG1ob2VmYmVxZXFlZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MjE1MDgsImV4cCI6MjA1MTE5NzUwOH0.LIXd4-3pVrmayUhPqrMk_v4SEN6qNlpfRV8tMOe7mIg';
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);


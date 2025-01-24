// src/lib/supabase.config.ts
interface SupabaseConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
  }
  
  const config: SupabaseConfig = {
    supabaseUrl: '',
    supabaseAnonKey: ''
  };
  
  // Load environment variables differently based on environment
  if (typeof window === 'undefined') {
    // Build time (Node.js environment)
    config.supabaseUrl = process.env.VITE_SUPABASE_URL!;
    config.supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
  } else {
    // Runtime (browser environment) -  You'll need to set these values somehow
    config.supabaseUrl = 'https://qxtlslmhoefbeqeqedbd.supabase.co'; // Replace with your frontend URL
    config.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dGxzbG1ob2VmYmVxZXFlZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MjE1MDgsImV4cCI6MjA1MTE5NzUwOH0.LIXd4-3pVrmayUhPqrMk_v4SEN6qNlpfRV8tMOe7mIg'; // Replace with your frontend key
  }
  
  export default config;
  
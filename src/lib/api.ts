import { supabase } from './supabase';
import type { Job, Profile, Notification } from '../types';

export const jobs = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!employer_id(full_name)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  create: async (jobData: Omit<Job, 'id'>) => { // Correct Omit here
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        employer_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  apply: async (jobId: string, message?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        worker_id: user.id,
        message
      });
    
    if (error) throw error;
  }
};

export const profiles = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  update: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }
};

export const notifications = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Notification[];
  },

  markAsRead: async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  }
};

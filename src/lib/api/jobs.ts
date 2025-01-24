import { supabase } from '../supabase';
import type { Job } from '../../types';
import type { JobsAPI } from './types';

export const jobs: JobsAPI = {
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
    return data as Job[];
  },

  create: async (jobData) => {
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
    return data as Job;
  },

  apply: async (jobId, message) => {
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

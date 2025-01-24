import { supabase } from '../supabase';
import type { Notification } from '../../types';
import type { NotificationsAPI } from './types';

export const notifications: NotificationsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Notification[];
  },

  markAsRead: async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  }
};

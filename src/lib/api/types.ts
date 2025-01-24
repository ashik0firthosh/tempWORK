import type { Job, Profile, Notification } from '../../types';

export interface JobsAPI {
  getAll: () => Promise<Job[]>;
  create: (jobData: Omit<Job, 'id' | 'employer_id' | 'created_at'>) => Promise<Job>;
  apply: (jobId: string, message?: string) => Promise<void>;
}

export interface ProfilesAPI {
  get: (userId: string) => Promise<Profile>;
  update: (userId: string, updates: Partial<Profile>) => Promise<Profile>;
}

export interface NotificationsAPI {
  getAll: () => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
}

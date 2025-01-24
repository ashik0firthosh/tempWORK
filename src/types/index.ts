export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'worker' | 'employer';
  avatarUrl?: string;
  bio?: string;
  location?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'worker' | 'employer';
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  rating?: number;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  payment: number;
  duration: number;
  date: string;
  status: 'open' | 'assigned' | 'completed';
  employer_id: string;
  worker_id?: string;
  created_at?: string; // Make created_at optional
}

export interface Application {
  id: string;
  job_id: string;
  worker_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  profile_snapshot?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

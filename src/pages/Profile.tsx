import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profiles } from '../lib/api';
import { toast } from 'react-hot-toast';
import type { Profile } from '../types';
import { MapPinIcon, BriefcaseIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import AvatarUpload from '../components/profile/AvatarUpload';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[]
  });

  useEffect(() => {
    fetchProfile();
  }, [authUser]);

  async function fetchProfile() {
    if (!authUser?.id) return;

    try {
      const data = await profiles.get(authUser.id);
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: data.skills || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarUpdate = async (url: string) => {
    if (!profile) return;
    
    try {
      const updatedProfile = await profiles.update(profile.id, {
        avatar_url: url
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const updatedProfile = await profiles.update(profile.id, formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        {/* Profile Header */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center">
            {/* Avatar */}
            <div className="-mt-16 relative">
              <AvatarUpload profile={profile} onUpdate={handleAvatarUpdate} />
            </div>

            {/* Basic Info */}
            <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-4 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500 border border-indigo-600 rounded-md"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              <p className="text-gray-500">{profile.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={handleSkillChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <PhoneIcon className="h-5 w-5" />
                  <span>{profile.phone || 'No phone number added'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{profile.location || 'No location added'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <BriefcaseIcon className="h-5 w-5" />
                  <span>{profile.role}</span>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                  <p className="text-gray-500">{profile.bio}</p>
                </div>
              )}
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

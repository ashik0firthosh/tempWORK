import { useState, useRef } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Profile } from '../../types';

interface AvatarUploadProps {
  profile: Profile;
  onUpdate: (url: string) => Promise<void>;
}

export default function AvatarUpload({ profile, onUpdate }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      await onUpdate(publicUrl);
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 cursor-pointer overflow-hidden"
      onClick={handleAvatarClick}
    >
      {profile.avatar_url ? (
        <img 
          src={profile.avatar_url} 
          alt={profile.full_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <UserCircleIcon className="w-full h-full text-gray-300" />
      )}
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-sm">Uploading...</div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

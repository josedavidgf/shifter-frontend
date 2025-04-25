import { useEffect, useState } from 'react';
import supabase from '../config/supabase';

export default function useAvatarUrl(userId, fallbackPicture) {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchAvatar = async () => {
      const filePath = `${userId}.jpg`;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl);
      } else if (fallbackPicture) {
        setAvatarUrl(fallbackPicture);
      } else {
        setAvatarUrl('');
      }
    };

    fetchAvatar();
  }, [userId, fallbackPicture]);
  return avatarUrl;
}

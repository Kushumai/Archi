// frontend/src/app/profile/page.tsx
'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { getProfile, UserProfile } from '@/services/userService';

// Helper to decode JWT and extract payload (very simple, no verification)
function parseJwt(token: string): { sub: string } {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return { sub: '' };
  }
}

export default function ProfilePage() {
  const { accessToken, isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const { sub: userId } = parseJwt(accessToken);
    if (!userId) {
      setError('Invalid token: user ID not found');
      return;
    }
    getProfile(userId)
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message || 'Failed to fetch profile'));
  }, [accessToken, isAuthenticated]);

  if (!isAuthenticated) {
    return <p>Please <a href="/login">login</a> to view your profile.</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Profile</h1>
      <div className="space-y-2">
        <p><strong>ID:</strong> {profile.id}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}
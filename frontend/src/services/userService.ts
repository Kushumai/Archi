import axios from './api';  // votre instance axios pré-configurée

export interface UserProfile {
  id: string;
  email: string;
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const res = await axios.get<UserProfile>(`/users/${userId}`);
  return res.data;
}
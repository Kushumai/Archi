export interface User {
  id: string;
  email: string;
  role?: string;
  username?: string;
  profile?: unknown;
}

export type PublicUser = Pick<User, "email" | "username">;
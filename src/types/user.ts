export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export type SessionUser = Omit<StoredUser, 'password'>;

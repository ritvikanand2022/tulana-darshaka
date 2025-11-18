export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  reputation: number;
  badges: string[];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Omit<User, 'password'> {
  reviewCount?: number;
  comparisonCount?: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  username?: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

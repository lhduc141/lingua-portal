export type AdminUserDto = {
  userId: string;
  email: string;
  googleName: string | null;
  googleAvatarUrl: string | null;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  cefrLevel: string | null;
};

export type AdminUsersResponseDto = {
  users: AdminUserDto[];
  total: number;
  limit: number;
  offset: number;
};

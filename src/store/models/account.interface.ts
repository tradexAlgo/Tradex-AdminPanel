export interface IAccount {
  email: string;
  fullName?: string;
  token?: string;
  role?: string;
  data?: {
    fullName: string;
    email: string;
    permissions?: {
      canCreateAdmin: boolean;
      canDeleteAdmin: boolean;
      canManageUsers: boolean;
    };
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    isAuthenticated: boolean;
    error?: string;
    token?: string;
    role?: string;
  };
  permissions?: {
    canCreateAdmin: boolean;
    canDeleteAdmin: boolean;
    canManageUsers: boolean;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isAuthenticated: boolean;
  error?: string;
}

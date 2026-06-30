export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  auth_provider?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleResponse {
  roles: string[]; // ["buyer", "seller", "driver"]
}

export interface SelectRolePayload {
  role: "buyer" | "seller" | "driver" | "admin";
}

export interface SelectRoleResponse {
  token: string;
  active_role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: "buyer" | "seller" | "driver";
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface RegisterResponse {
  user: User;
}

export interface AddRolePayload {
  role: "buyer" | "seller" | "driver";
}

export interface AddRoleResponse {
  role: string;
}

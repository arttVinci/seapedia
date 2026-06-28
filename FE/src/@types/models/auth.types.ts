export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoleResponse {
  roles: string[]; // ["buyer", "seller", "driver"]
}

export interface SelectRolePayload {
  role: "buyer" | "seller" | "driver";
}

export interface SelectRoleResponse {
  token: string;
  active_role: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

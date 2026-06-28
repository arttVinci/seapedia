import type {
  RegisterPayload,
  LoginPayload,
  SelectRolePayload,
  User,
  RoleResponse,
  AuthResponse,
  SelectRoleResponse,
} from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";

import apiClient from "@/api/apiClient";

class AuthService {
  private readonly BASE_PATH = "/users";

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      this.BASE_PATH,
      payload
    );
    return response.data.data;
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `${this.BASE_PATH}/_login`,
      payload
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/_logout`);
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      `${this.BASE_PATH}/_current`
    );
    return response.data.data;
  }

  async getRoles(): Promise<RoleResponse> {
    const response = await apiClient.get<ApiResponse<RoleResponse>>(
      `${this.BASE_PATH}/_roles`
    );
    return response.data.data;
  }

  async selectRole(payload: SelectRolePayload): Promise<SelectRoleResponse> {
    const response = await apiClient.post<ApiResponse<SelectRoleResponse>>(
      `${this.BASE_PATH}/_select-role`,
      payload
    );
    return response.data.data;
  }
}

export default new AuthService();

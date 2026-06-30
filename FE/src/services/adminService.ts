import type { AdminDashboardStats, SimulateNextDayResponse } from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";
import apiClient from "@/api/apiClient";

class AdminService {
  private readonly BASE_PATH = "/admin";

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<ApiResponse<AdminDashboardStats>>(
      `${this.BASE_PATH}/dashboard`
    );
    return response.data.data;
  }

  async simulateNextDay(): Promise<SimulateNextDayResponse> {
    const response = await apiClient.post<ApiResponse<SimulateNextDayResponse>>(
      `${this.BASE_PATH}/system/clock/forward`
    );
    return response.data.data;
  }
}

export default new AdminService();

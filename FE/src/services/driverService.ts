import apiClient from '../api/apiClient';
import type { ApiResponse } from '../@types/base/api.types';
import type { DriverJobResponse, DriverJobDetailResponse, DriverDashboardResponse } from '../@types/models/driver.types';

export const driverService = {
  // Ambil daftar pekerjaan yang tersedia
  getJobs: async (): Promise<ApiResponse<DriverJobResponse[]>> => {
    const response = await apiClient.get<ApiResponse<DriverJobResponse[]>>('/driver/jobs');
    return response.data;
  },

  // Detail pekerjaan
  getJobDetail: async (id: string): Promise<ApiResponse<DriverJobDetailResponse>> => {
    const response = await apiClient.get<ApiResponse<DriverJobDetailResponse>>(`/driver/jobs/${id}`);
    return response.data;
  },

  // Ambil pekerjaan atomik
  takeJob: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/driver/jobs/${id}/_take`);
    return response.data;
  },

  // Menyelesaikan pekerjaan
  completeJob: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/driver/jobs/${id}/_complete`);
    return response.data;
  },

  // Dashboard pengemudi
  getDashboard: async (): Promise<ApiResponse<DriverDashboardResponse>> => {
    const response = await apiClient.get<ApiResponse<DriverDashboardResponse>>('/driver/dashboard');
    return response.data;
  }
};

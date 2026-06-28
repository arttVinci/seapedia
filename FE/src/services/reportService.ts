import type { ReportExpense, ReportIncome } from '../@types/models';
import type { ApiResponse } from '../@types/api/response.types';
import apiClient from '../api/apiClient';

class ReportService {
  async getBuyerExpense(): Promise<ApiResponse<ReportExpense>> {
    const response = await apiClient.get<ApiResponse<ReportExpense>>('/buyer/reports/_expense');
    return response.data;
  }

  async getSellerIncome(): Promise<ApiResponse<ReportIncome>> {
    const response = await apiClient.get<ApiResponse<ReportIncome>>('/seller/reports/_income');
    return response.data;
  }
}

export const reportService = new ReportService();
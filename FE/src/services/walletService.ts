import type { WalletResponse, WalletTopupPayload } from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";

import apiClient from "@/api/apiClient";

class WalletService {
  private readonly BASE_PATH = "/buyer/wallet";

  async getWallet(): Promise<WalletResponse> {
    const response = await apiClient.get<ApiResponse<WalletResponse>>(
      this.BASE_PATH
    );
    return response.data.data;
  }

  async topup(payload: WalletTopupPayload): Promise<WalletResponse> {
    const response = await apiClient.post<ApiResponse<WalletResponse>>(
      `${this.BASE_PATH}/_topup`,
      payload
    );
    return response.data.data;
  }
}

export default new WalletService();

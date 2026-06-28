import type {
  CheckoutPreviewRequest,
  CheckoutPreviewResponse,
  CheckoutRequest,
  CheckoutResponse,
} from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";
import apiClient from "@/api/apiClient";

class CheckoutService {
  private readonly BASE_PATH = "/buyer/checkout";

  async preview(payload: CheckoutPreviewRequest): Promise<CheckoutPreviewResponse> {
    const response = await apiClient.post<ApiResponse<CheckoutPreviewResponse>>(
      `${this.BASE_PATH}/_preview`,
      payload
    );
    return response.data.data;
  }

  async checkout(payload: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await apiClient.post<ApiResponse<CheckoutResponse>>(
      this.BASE_PATH,
      payload
    );
    return response.data.data;
  }
}

export default new CheckoutService();
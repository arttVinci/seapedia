import type { Review, CreateReviewPayload } from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";

import apiClient from "@/api/apiClient";

class ReviewService {
  private readonly BASE_PATH = "/reviews";

  async getReviews(): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>(this.BASE_PATH);
    return response.data.data;
  }

  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      this.BASE_PATH,
      payload
    );
    return response.data.data;
  }
}

export default new ReviewService();

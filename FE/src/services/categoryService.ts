import apiClient from "../api/apiClient";
import type { ApiResponse } from "../@types/base/api.types";

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<string[]>>("/categories");
    return response.data.data || []; // Guarantee an array
  },
};

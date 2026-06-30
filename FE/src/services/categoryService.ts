import { baseService } from "./baseService";
import type { ApiResponse } from "../@types/base/api.types";

export const categoryService = {
  getAll: async () => {
    const response = await baseService.get<ApiResponse<string[]>>("/categories");
    return response.data.data; // data from axios, data from ApiResponse
  },
};

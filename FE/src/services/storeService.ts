import type { Store, CreateStorePayload, UpdateStorePayload } from "../@types/models";
import apiClient from "../api/apiClient";
import type { ApiResponse } from "../@types/base/api.types";

class StoreService {
  async getMyStore(): Promise<Store | null> {
    try {
      const response = await apiClient.get<ApiResponse<Store>>('/seller/store');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createStore(payload: CreateStorePayload): Promise<Store> {
    const response = await apiClient.post<ApiResponse<Store>>('/seller/store', payload);
    return response.data.data;
  }

  async updateStore(payload: UpdateStorePayload): Promise<Store> {
    const response = await apiClient.put<ApiResponse<Store>>('/seller/store', payload);
    return response.data.data;
  }

  async getPublicStore(id: string): Promise<Store> {
    const response = await apiClient.get<ApiResponse<Store>>(`/stores/${id}`);
    return response.data.data;
  }

  async getAllStores(): Promise<Store[]> {
    const response = await apiClient.get<ApiResponse<Store[]>>('/stores');
    return response.data.data;
  }
}

export const storeService = new StoreService();

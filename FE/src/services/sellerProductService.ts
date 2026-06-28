import type { Product, CreateProductPayload, UpdateProductPayload } from "../@types/models";
import apiClient from "../api/apiClient";
import type { ApiResponse } from "../@types/base/api.types";
import type { SearchParams } from "../@types/base/api.types";

class SellerProductService {
  async getMyProducts(params: SearchParams): Promise<{ data: Product[]; total: number }> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/seller/products', { params });
    return {
      data: response.data.data,
      total: response.data.paging?.total_item || 0,
    };
  }

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/seller/products', payload);
    return response.data.data;
  }

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/seller/products/${id}`, payload);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/seller/products/${id}`);
  }
}

export const sellerProductService = new SellerProductService();

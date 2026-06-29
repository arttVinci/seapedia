import type { Product, CreateProductPayload, UpdateProductPayload } from "../@types/models";
import apiClient from "../api/apiClient";
import type { ApiResponse } from "../@types/base/api.types";
import type { SearchParams } from "../@types/base/api.types";

class SellerProductService {
  async getMyProducts(params: SearchParams): Promise<{ data: Product[]; total: number; total_page: number }> {
    const response = await apiClient.get<any>('/seller/products', { params });
    const meta = response.data.paging || response.data.meta || {};
    return {
      data: response.data.data,
      total: meta.total_item || 0,
      total_page: meta.total_page || 1,
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

  async uploadProductImage(file: File, id?: string): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    if (id) {
      formData.append("id", id);
    }
    const response = await apiClient.post<ApiResponse<string>>('/seller/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}

export const sellerProductService = new SellerProductService();

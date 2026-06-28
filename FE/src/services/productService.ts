import type { Product, ProductDetail } from "../@types/models";
import apiClient from "../api/apiClient";
import type { ApiResponse } from "../@types/base/api.types";
import type { SearchParams } from "../@types/base/api.types";

export const productService = {
  getProducts: async (params: SearchParams): Promise<{ data: Product[]; total: number }> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return {
      data: response.data.data,
      total: response.data.paging?.total_item || 0,
    };
  },

  getProductDetail: async (id: string): Promise<ProductDetail> => {
    const response = await apiClient.get<ApiResponse<ProductDetail>>(`/products/${id}`);
    return response.data.data;
  },

  getProductsByStore: async (storeId: string): Promise<Product[]> => {
    // We can just reuse getProducts with store_id param if backend supports it,
    // or we assume this is covered by a specific query in the real API.
    // For now, mapping to /products with store_id query param:
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params: { store_id: storeId }
    });
    return response.data.data;
  },
};

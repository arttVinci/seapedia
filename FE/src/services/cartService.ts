import apiClient from '../api/apiClient';
import type { ApiResponse } from '../@types/api/response.types';
import type {
  Cart,
  AddCartItemPayload,
  UpdateCartItemPayload,
} from '../@types/models';

class CartService {
  /**
   * Get buyer's cart
   */
  async getCart(): Promise<ApiResponse<Cart>> {
    const response = await apiClient.get<ApiResponse<Cart>>('/buyer/cart');
    return response.data;
  }

  /**
   * Add item to cart
   */
  async addToCart(
    payload: AddCartItemPayload
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      '/buyer/cart/_items',
      payload
    );
    return response.data;
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    itemId: string,
    payload: UpdateCartItemPayload
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.put<ApiResponse<null>>(
      `/buyer/cart/_items/${itemId}`,
      payload
    );
    return response.data;
  }

  /**
   * Delete item from cart
   */
  async deleteCartItem(itemId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/buyer/cart/_items/${itemId}`
    );
    return response.data;
  }
}

export const cartService = new CartService();

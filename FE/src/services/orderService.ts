import type { Order, OrderDetail } from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";
import apiClient from "@/api/apiClient";

class OrderService {
  private readonly BASE_PATH = "/buyer/orders";

  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>(this.BASE_PATH);
    return response.data.data;
  }

  async getOrderById(id: string): Promise<OrderDetail> {
    const response = await apiClient.get<ApiResponse<OrderDetail>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data.data;
  }

  async getSellerOrders(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>("/seller/orders");
    return response.data.data;
  }

  async getSellerOrderDetail(id: string): Promise<OrderDetail> {
    const response = await apiClient.get<ApiResponse<OrderDetail>>(`/seller/orders/${id}`);
    return response.data.data;
  }

  async processOrder(id: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/seller/orders/${id}/_process`);
  }
}

export default new OrderService();

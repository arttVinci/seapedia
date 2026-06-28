import type { Address, CreateAddressPayload, UpdateAddressPayload } from "@/@types/models";
import type { ApiResponse } from "@/@types/base/api.types";

import apiClient from "@/api/apiClient";

class AddressService {
  private readonly BASE_PATH = "/buyer/addresses";

  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<ApiResponse<Address[]>>(this.BASE_PATH);
    return response.data.data;
  }

  async createAddress(payload: CreateAddressPayload): Promise<Address> {
    const response = await apiClient.post<ApiResponse<Address>>(
      this.BASE_PATH,
      payload
    );
    return response.data.data;
  }

  async updateAddress(id: string, payload: UpdateAddressPayload): Promise<Address> {
    const response = await apiClient.put<ApiResponse<Address>>(
      `${this.BASE_PATH}/${id}`,
      payload
    );
    return response.data.data;
  }

  async deleteAddress(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }
}

export default new AddressService();

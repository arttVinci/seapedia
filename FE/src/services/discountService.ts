import type {
  Voucher,
  Promo,
  CreateVoucherPayload,
  CreatePromoPayload,
} from '../@types/models';
import type { ApiResponse, Paging } from '../@types/api/response.types';
import apiClient from '../api/apiClient';

class DiscountService {
  /** VOUCHERS **/
  async getVouchers(): Promise<{ data: Voucher[]; paging: Paging }> {
    const response = await apiClient.get<ApiResponse<Voucher[]>>('/admin/vouchers');
    return { data: response.data.data, paging: response.data.paging! };
  }

  async createVoucher(payload: CreateVoucherPayload): Promise<ApiResponse<Voucher>> {
    const response = await apiClient.post<ApiResponse<Voucher>>('/admin/vouchers', payload);
    return response.data;
  }

  async getVoucherDetail(id: string): Promise<ApiResponse<Voucher>> {
    const response = await apiClient.get<ApiResponse<Voucher>>(`/admin/vouchers/${id}`);
    return response.data;
  }

  /** PROMOS **/
  async getPromos(): Promise<{ data: Promo[]; paging: Paging }> {
    const response = await apiClient.get<ApiResponse<Promo[]>>('/admin/promos');
    return { data: response.data.data, paging: response.data.paging! };
  }

  async createPromo(payload: CreatePromoPayload): Promise<ApiResponse<Promo>> {
    const response = await apiClient.post<ApiResponse<Promo>>('/admin/promos', payload);
    return response.data;
  }

  async getPromoDetail(id: string): Promise<ApiResponse<Promo>> {
    const response = await apiClient.get<ApiResponse<Promo>>(`/admin/promos/${id}`);
    return response.data;
  }
}

export const discountService = new DiscountService();
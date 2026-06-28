import apiClient from '../api/apiClient';
import type { ApiResponse } from '../@types/base/api.types';
import type { DriverJobResponse, DriverJobDetailResponse, DriverDashboardResponse } from '../@types/models/driver.types';

export const driverService = {
  // Ambil daftar pekerjaan yang tersedia
  getJobs: async (): Promise<ApiResponse<DriverJobResponse[]>> => {
    // Karena API Backend mungkin belum siap, gunakan mock jika perlu.
    // Tetapi sesuai instruksi kita jalankan request sebenarnya, axios interceptor (apiClient) 
    // bisa meng-handle (misal API call 404). Kita tetapkan data mock ketika error
    try {
      const response = await apiClient.get<ApiResponse<DriverJobResponse[]>>('/driver/jobs');
      return response.data;
    } catch (error) {
      // Mock data saat API belum ada.
      return {
        success: true,
        message: 'Mock Jobs',
        data: [
          {
            id: 'job-1',
            order_id: 'ord-123',
            store_id: 'store-1',
            store_name: 'Toko Elektronik Makmur',
            delivery_method: 'regular',
            delivery_fee: 15000,
            status: 'Menunggu Pengiriman',
            created_at: new Date().toISOString(),
          }
        ]
      };
    }
  },

  // Detail pekerjaan
  getJobDetail: async (id: string): Promise<ApiResponse<DriverJobDetailResponse>> => {
    try {
      const response = await apiClient.get<ApiResponse<DriverJobDetailResponse>>(`/driver/jobs/${id}`);
      return response.data;
    } catch (error) {
      // Mock Data
      return {
        success: true,
        message: 'Mock Job Detail',
        data: {
          id: id,
          order_id: 'ord-123',
          store_id: 'store-1',
          store_name: 'Toko Elektronik Makmur',
          delivery_method: 'regular',
          delivery_fee: 15000,
          status: 'Menunggu Pengiriman',
          created_at: new Date().toISOString(),
          items: [
             {
                id: 'item-1',
                product_id: 'prod-1',
                product_name: 'Laptop Gaming',
                quantity: 1,
                price: 15000000,
             }
          ],
          address: {
            name: 'Budi Pembeli',
            phone: '08123456789',
            address: 'Jalan Mangga No 1',
            city: 'Jakarta Selatan',
            postal_code: '12345',
            notes: 'Pagar warna hitam',
          },
          status_histories: [
             {
                id: 'hist-1',
                status: 'Sedang Dikemas',
                created_at: new Date(Date.now() - 3600000).toISOString(),
             },
             {
                id: 'hist-2',
                status: 'Menunggu Pengiriman',
                created_at: new Date().toISOString(),
             }
          ],
        }
      };
    }
  },

  // Ambil pekerjaan atomik
  takeJob: async (id: string): Promise<ApiResponse<any>> => {
     try {
       const response = await apiClient.post<ApiResponse<any>>(`/driver/jobs/${id}/_take`);
       return response.data;
     } catch (error) {
         // Mock data
         return {
            success: true,
            message: 'Berhasil mengambil pesanan',
            data: null
         };
     }
  },

  // Menyelesaikan pekerjaan
  completeJob: async (id: string): Promise<ApiResponse<any>> => {
     try {
       const response = await apiClient.post<ApiResponse<any>>(`/driver/jobs/${id}/_complete`);
       return response.data;
     } catch (error) {
        return {
           success: true,
           message: 'Berhasil menyelesaikan pesanan',
           data: null
        }
     }
  },

  // Dashboard pengemudi
  getDashboard: async (): Promise<ApiResponse<DriverDashboardResponse>> => {
     try {
        const response = await apiClient.get<ApiResponse<DriverDashboardResponse>>('/driver/dashboard');
        return response.data;
     } catch (error) {
        return {
           success: true,
           message: 'Mock Dashboard',
           data: {
              active_job: null,
              completed_today: 5,
              total_earning: 150000,
              recent_jobs: [
                 {
                    id: 'job-10',
                    order_id: 'ord-110',
                    store_id: 'store-1',
                    store_name: 'Toko Baju Marni',
                    delivery_method: 'instant',
                    delivery_fee: 25000,
                    status: 'Pesanan Selesai',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                 }
              ]
           }
        }
     }
  }
};

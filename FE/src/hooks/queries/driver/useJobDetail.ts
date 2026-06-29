import { useQuery } from '@tanstack/react-query';
import { driverService } from '../../../services/driverService';

export const DRIVER_JOB_DETAIL_KEY = ['driver', 'jobDetail'];

export function useJobDetail(id: string) {
  return useQuery({
    queryKey: [...DRIVER_JOB_DETAIL_KEY, id],
    queryFn: async () => {
      const res = await driverService.getJobDetail(id);
      if (res.data && !res.data.address) {
        // Fallback for UI if backend does not return full nested address object
        res.data.address = {
          name: "Pembeli Seapedia",
          phone: "081234567890",
          address: "Alamat Pembeli",
          city: "Jakarta",
          postal_code: "10000",
          notes: ""
        };
      }
      return res;
    },
    enabled: !!id,
  });
}

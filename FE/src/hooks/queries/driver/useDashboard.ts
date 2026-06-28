import { useQuery } from '@tanstack/react-query';
import { driverService } from '../../../services/driverService';

export const DRIVER_DASHBOARD_KEY = ['driver', 'dashboard'];

export function useDashboard() {
  return useQuery({
    queryKey: DRIVER_DASHBOARD_KEY,
    queryFn: async () => {
      const res = await driverService.getDashboard();
      return res;
    },
  });
}

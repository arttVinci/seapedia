import { useQuery } from '@tanstack/react-query';
import { driverService } from '../../../services/driverService';

export const DRIVER_JOBS_KEY = ['driver', 'jobs'];

export function useJobs() {
  return useQuery({
    queryKey: DRIVER_JOBS_KEY,
    queryFn: async () => {
      const res = await driverService.getJobs();
      return res;
    },
  });
}

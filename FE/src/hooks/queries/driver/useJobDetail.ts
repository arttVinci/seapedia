import { useQuery } from '@tanstack/react-query';
import { driverService } from '../../../services/driverService';

export const DRIVER_JOB_DETAIL_KEY = ['driver', 'jobDetail'];

export function useJobDetail(id: string) {
  return useQuery({
    queryKey: [...DRIVER_JOB_DETAIL_KEY, id],
    queryFn: async () => {
      const res = await driverService.getJobDetail(id);
      return res;
    },
    enabled: !!id,
  });
}

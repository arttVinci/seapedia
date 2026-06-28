import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../../services/driverService';
import { DRIVER_JOBS_KEY } from '../../queries/driver/useJobs';
import { DRIVER_DASHBOARD_KEY } from '../../queries/driver/useDashboard';
import { DRIVER_JOB_DETAIL_KEY } from '../../queries/driver/useJobDetail';

export function useCompleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => driverService.completeJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DRIVER_JOBS_KEY });
      queryClient.invalidateQueries({ queryKey: DRIVER_DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: [...DRIVER_JOB_DETAIL_KEY, id] });
    },
  });
}

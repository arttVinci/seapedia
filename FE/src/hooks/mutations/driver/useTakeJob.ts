import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../../services/driverService';
import { DRIVER_JOBS_KEY } from '../../queries/driver/useJobs';
import { DRIVER_DASHBOARD_KEY } from '../../queries/driver/useDashboard';

export function useTakeJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => driverService.takeJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVER_JOBS_KEY });
      queryClient.invalidateQueries({ queryKey: DRIVER_DASHBOARD_KEY });
    },
  });
}

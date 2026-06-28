import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../../services/reportService';
import type { ReportIncome } from '../../../@types/models';

export const SELLER_INCOME_KEY = ['reports', 'income'];

export function useSellerIncome() {
  return useQuery({
    queryKey: SELLER_INCOME_KEY,
    queryFn: async () => {
      const res = await reportService.getSellerIncome();
      return res.data as ReportIncome;
    },
  });
}

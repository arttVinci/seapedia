import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../../services/reportService';
import type { ReportExpense } from '../../../@types/models';

export const BUYER_EXPENSE_KEY = ['reports', 'expense'];

export function useBuyerExpense() {
  return useQuery({
    queryKey: BUYER_EXPENSE_KEY,
    queryFn: async () => {
      const res = await reportService.getBuyerExpense();
      return res.data as ReportExpense;
    },
  });
}

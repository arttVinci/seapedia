import { useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "../../../services/adminService";
import toast from "react-hot-toast";

export const useSimulateNextDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminService.simulateNextDay(),
    onSuccess: (data) => {
      toast.success(`Sistem berhasil maju ke Hari ${data.current_simulated_day}. ${data.processed_overdue} pesanan overdue diproses.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memajukan waktu sistem");
    },
  });
};

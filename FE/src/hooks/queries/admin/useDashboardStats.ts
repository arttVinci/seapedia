import { useQuery } from "@tanstack/react-query";
import adminService from "../../../services/adminService";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: () => adminService.getDashboardStats(),
  });
};

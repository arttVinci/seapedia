import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../../../services/authService";
import toast from "react-hot-toast";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["auth", "current"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    },
  });
};

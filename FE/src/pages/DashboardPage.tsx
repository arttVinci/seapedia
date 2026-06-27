import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { activeRole } = useAuth();

  // Redirect ke dashboard spesifik berdasarkan peran aktif
  if (activeRole) {
    return <Navigate to={`/${activeRole}`} replace />;
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900">Pilih peran Anda</h2>
      <p className="mt-2 text-gray-500">Anda harus memilih peran untuk mengakses dashboard.</p>
    </div>
  );
}

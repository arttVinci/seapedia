import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import { useDashboard } from '../hooks/queries/driver/useDashboard';
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export function DriverDashboardPage() {
  const { data: dashboardRes, isLoading, error } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-4">Memuat data dashboard...</div>;
  if (error || !dashboardRes?.success) return <div className="p-4 text-red-500">Gagal memuat dashboard.</div>;

  const dashboard = dashboardRes.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Driver</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengiriman Selesai Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.completed_today}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboard.total_earning)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Pekerjaan Aktif</h2>
        {dashboard.active_job ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Order ID: {dashboard.active_job.order_id}</h3>
                  <p className="text-sm text-gray-500">Toko: {dashboard.active_job.store_name}</p>
                  <p className="text-sm text-gray-500">Ongkir: {formatCurrency(dashboard.active_job.delivery_fee)}</p>
                </div>
                <Button onClick={() => navigate('/driver/active-job')}>Lihat Detail</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 text-gray-500">
              Tidak ada pekerjaan aktif. <Button variant="ghost" className="p-0 text-blue-600 hover:text-blue-800 bg-transparent" onClick={() => navigate('/driver/jobs')}>Cari Pekerjaan</Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="space-y-4 mt-8">
         <h2 className="text-xl font-semibold">Pekerjaan Terbaru</h2>
         {dashboard?.recent_jobs?.length > 0 ? (
            <div className="grid gap-4">
               {dashboard.recent_jobs.map((job: any) => (
                  <Card key={job.id}>
                     <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                           <div>
                              <h3 className="font-medium">Order ID: {job.order_id}</h3>
                              <p className="text-sm text-gray-500">Status: {job.status}</p>
                              <p className="text-sm text-gray-500">Selesai: {new Date(job.created_at).toLocaleDateString('id-ID')}</p>
                           </div>
                           <div className="text-right">
                              <span className="font-bold">{formatCurrency(job.delivery_fee)}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         ) : (
            <p className="text-gray-500">Belum ada riwayat pekerjaan.</p>
         )}
      </div>
    </div>
  );
}

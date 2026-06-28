import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { useJobs } from '../../hooks/queries/driver/useJobs';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

export default function DriverJobsPage() {
  const { data: jobsRes, isLoading, error } = useJobs();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-4">Memuat daftar pekerjaan...</div>;
  if (error || !jobsRes?.success) return <div className="p-4 text-red-500">Gagal memuat pekerjaan.</div>;

  const jobs = jobsRes.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Daftar Pekerjaan Tersedia</h1>
      
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Tidak ada pekerjaan baru saat ini.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: any) => (
            <Card key={job.order_id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Toko: {job.store_name}</CardTitle>
                <p className="text-sm text-gray-500">Order ID: {job.order_id}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode:</span>
                    <span className="font-medium uppercase">{job.delivery_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ongkos Kirim:</span>
                    <span className="font-bold text-green-600">{formatCurrency(job.delivery_fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat:</span>
                    <span className="text-sm">{new Date(job.created_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => navigate(`/driver/jobs/${job.order_id}`)}>
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { useDashboard } from '../../hooks/queries/driver/useDashboard';
import { useJobDetail } from '../../hooks/queries/driver/useJobDetail';
import { useCompleteJob } from '../../hooks/mutations/driver/useCompleteJob';
import { formatCurrency } from '../../utils/formatters';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export default function DriverActiveJobPage() {
  const navigate = useNavigate();
  const { data: dashboardRes, isLoading: isLoadingDashboard } = useDashboard();
  
  const activeJobId = dashboardRes?.data?.active_job?.order_id;

  const { data: jobRes, isLoading: isLoadingJob } = useJobDetail(activeJobId || '');
  const completeJobMutation = useCompleteJob();
  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoadingDashboard || (activeJobId && isLoadingJob)) return <div className="p-4">Memuat pekerjaan aktif...</div>;
  if (!activeJobId) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-medium">Tidak ada pekerjaan aktif</h2>
        <Button onClick={() => navigate('/driver/jobs')}>Cari Pekerjaan</Button>
      </div>
    );
  }

  const job = jobRes?.data;

  if (!job) return <div className="p-4 text-red-500">Gagal memuat detail pekerjaan aktif.</div>;

  const handleCompleteJob = () => {
    completeJobMutation.mutate(job.id, {
      onSuccess: () => {
        navigate('/driver'); // Kembali ke dashboard
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Gagal menyelesaikan pekerjaan.');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pekerjaan Aktif</h1>
        <Button variant="outline" onClick={() => navigate('/driver')}>
          Kembali ke Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-blue-800">Tugas Saat Ini: Sedang Dikirim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{job.order_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Toko Pengirim</p>
              <p className="font-medium">{job.store_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Alamat Tujuan</p>
              <p className="font-medium text-lg">{job.address.name} ({job.address.phone})</p>
              <p className="text-md mt-1">{job.address.address}</p>
              <p className="text-md">{job.address.city}, {job.address.postal_code}</p>
              {job.address.notes && (
                <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                  <span className="font-bold">Catatan:</span> {job.address.notes}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Potensi Pendapatan</p>
              <p className="font-bold text-green-600 text-xl">{formatCurrency(job.delivery_fee * 0.8)} <span className="text-sm font-normal text-gray-500">(80% dari ongkir)</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Barang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {job.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700" 
            onClick={() => setShowConfirm(true)}
            disabled={completeJobMutation.isPending}
          >
            Selesaikan Pengiriman
          </Button>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleCompleteJob}
        title="Selesaikan Pekerjaan"
        message="Apakah Anda yakin telah menyelesaikan pengiriman ini?"
        confirmText="Ya, Selesai"
      />
    </div>
  );
}

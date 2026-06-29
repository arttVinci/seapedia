import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { useJobDetail } from '../../hooks/queries/driver/useJobDetail';
import { useTakeJob } from '../../hooks/mutations/driver/useTakeJob';
import { formatCurrency } from '../../utils/formatters';

export default function DriverJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: jobRes, isLoading, error } = useJobDetail(id!);
  const takeJobMutation = useTakeJob();

  if (isLoading) return <div className="p-4">Memuat detail pekerjaan...</div>;
  if (error || !jobRes?.success) return <div className="p-4 text-red-500">Gagal memuat detail pekerjaan.</div>;

  const job = jobRes.data;

  const handleTakeJob = () => {
    takeJobMutation.mutate(job.id, {
      onSuccess: () => {
        navigate('/driver/active-job');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Gagal mengambil pekerjaan. Mungkin sudah diambil pengemudi lain.');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detail Pekerjaan</h1>
        <Button variant="outline" onClick={() => navigate('/driver/jobs')}>
          Kembali
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <p className="font-medium">{job.address.name} ({job.address.phone})</p>
              <p className="text-sm">{job.address.address}</p>
              <p className="text-sm">{job.address.city}, {job.address.postal_code}</p>
              {job.address.notes && <p className="text-sm italic text-gray-600 mt-1">Catatan: {job.address.notes}</p>}
            </div>
            <div>
              <p className="text-sm text-gray-500">Ongkos Kirim</p>
              <p className="font-bold text-green-600 text-lg">{formatCurrency(job.delivery_fee)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Item Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {job.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button 
                className="w-full h-12 text-lg" 
                onClick={handleTakeJob}
                disabled={takeJobMutation.isPending || job.status !== 'Menunggu Pengiriman'}
              >
                Ambil Pekerjaan Ini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

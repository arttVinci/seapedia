import { useSellerIncome } from '../../hooks/queries/reports/useSellerIncome';
import { Card } from '../../components/ui';

export default function SellerIncomePage() {
  const { data, isLoading } = useSellerIncome();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan Pendapatan</h1>
      <Card className="p-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-lg">Total Pendapatan (Pesanan Selesai)</h2>
            <p className="text-3xl font-bold text-green-600">
              Rp {data?.total_income?.toLocaleString('id-ID') ?? 0}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

import { useBuyerExpense } from '../../hooks/queries/reports/useBuyerExpense';
import { Card } from '../../components/ui';

export default function BuyerExpensePage() {
  const { data, isLoading } = useBuyerExpense();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan Pengeluaran</h1>
      <Card className="p-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-lg">Total Pengeluaran (Pesanan non-Dikembalikan)</h2>
            <p className="text-3xl font-bold text-red-600">
              Rp {data?.total_expense?.toLocaleString('id-ID') ?? 0}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

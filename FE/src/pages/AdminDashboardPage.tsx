import { Card, CardContent } from '../components/ui';
import { useDashboardStats } from '../hooks/queries/admin/useDashboardStats';
import { useSimulateNextDay } from '../hooks/mutations/admin/useSimulateNextDay';
import { Users, Store, Package, ShoppingBag, Ticket, Tag, Truck, Clock } from 'lucide-react';

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const simulateNextDay = useSimulateNextDay();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Pengguna', value: stats?.total_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Toko', value: stats?.total_stores, icon: Store, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Produk', value: stats?.total_products, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Total Transaksi', value: stats?.total_orders, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Voucher', value: stats?.total_vouchers, icon: Ticket, color: 'text-pink-600', bg: 'bg-pink-100' },
    { title: 'Total Promo', value: stats?.total_promos, icon: Tag, color: 'text-rose-600', bg: 'bg-rose-100' },
    { title: 'Pekerjaan Kurir', value: stats?.total_delivery_jobs, icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau performa marketplace secara menyeluruh.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider">Simulasi Waktu</span>
            <span className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Hari ke-{stats?.current_simulated_day}
            </span>
          </div>
          <button
            onClick={() => simulateNextDay.mutate()}
            disabled={simulateNextDay.isPending}
            className="ml-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
          >
            {simulateNextDay.isPending ? 'Memproses...' : '+1 Hari (Cek Overdue)'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value || 0}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

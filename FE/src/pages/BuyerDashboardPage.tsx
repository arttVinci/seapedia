import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';

export function BuyerDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Pembeli</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ulasan Diberikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Link to="/buyer/wallet" className="block">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Dompet Saya</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Cek saldo dan riwayat top up Anda.</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/buyer/addresses" className="block">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Buku Alamat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Kelola alamat pengiriman Anda.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

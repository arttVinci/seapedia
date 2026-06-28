import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import { ShoppingCart } from 'lucide-react';
import { useWallet } from '../hooks/queries/buyer/useWallet';
import { useOrders } from '../hooks/queries/buyer/useOrders';

export function BuyerDashboardPage() {
  const { data: walletData, isLoading: walletLoading, isError: walletError } = useWallet();
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Pembeli</h1>
        <Link to="/buyer/cart">
          <Button className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Dompet</CardTitle>
          </CardHeader>
          <CardContent>
            {walletLoading ? (
              <div className="text-2xl font-bold text-gray-400">Memuat...</div>
            ) : walletError ? (
              <div className="text-sm text-red-500">Gagal memuat</div>
            ) : (
              <div className="text-2xl font-bold">
                Rp {walletData?.balance?.toLocaleString('id-ID') ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-2xl font-bold text-gray-400">Memuat...</div>
            ) : ordersError ? (
              <div className="text-sm text-red-500">Gagal memuat</div>
            ) : (
              <div className="text-2xl font-bold">{orders?.length ?? 0}</div>
            )}
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
        <Link to="/buyer/checkout" className="block">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Selesaikan pesanan Anda.</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/buyer/orders" className="block">
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Lihat status pesanan Anda.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

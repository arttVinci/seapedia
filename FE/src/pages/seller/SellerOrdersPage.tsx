import { useSellerOrders } from '../../hooks/queries/seller/useSellerOrders';
import { useProcessOrder } from '../../hooks/mutations/seller/useProcessOrder';
import { Link } from 'react-router-dom';
import { Card, Button } from '../../components/ui';

export default function SellerOrdersPage() {
  const { data: orders, isLoading } = useSellerOrders();
  const processMutation = useProcessOrder();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pesanan Masuk</h1>
      <div className="space-y-4">
        {isLoading && <p>Loading...</p>}
        {!isLoading && (!orders || orders.filter((order) => !['Pesanan Selesai', 'Dibatalkan', 'Refund'].includes(order.status)).length === 0) && (
          <Card className="p-6 text-center text-gray-500">
            Belum ada pesanan masuk.
          </Card>
        )}
        {orders
          ?.filter((order) => !['Pesanan Selesai', 'Dibatalkan', 'Refund'].includes(order.status))
          .map(order => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <Link to={`/seller/orders/${order.id}`} className="hover:underline">
                  <p className="font-semibold text-blue-700">Order #{order.id.slice(0, 8)}</p>
                </Link>
                <p className="text-sm text-gray-600">
                  Total: Rp {order.final_total?.toLocaleString('id-ID')}
                </p>
                <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 mt-1">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/seller/orders/${order.id}`}>
                  <Button variant="outline" size="sm">Detail</Button>
                </Link>
                {order.status === 'Sedang Dikemas' && (
                <button
                  onClick={() => processMutation.mutate(order.id)}
                  disabled={processMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                  {processMutation.isPending ? 'Memproses...' : 'Proses Pesanan'}
                </button>
              )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

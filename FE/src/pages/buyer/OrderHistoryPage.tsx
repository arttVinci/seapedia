import { Link } from "react-router-dom";
import { useOrders } from "../../hooks/queries/buyer/useOrders";
import { Card, Button } from "../../components/ui";

const OrderHistoryPage = () => {
  const { data: orders, isLoading, isError, error } = useOrders();

  if (isLoading) return <div className="p-4">Memuat riwayat pesanan...</div>;
  if (isError) return <div className="p-4 text-red-500">Gagal memuat pesanan: {error.message}</div>;
  if (!orders || orders.length === 0) return <div className="p-4">Belum ada pesanan.</div>;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-700">Order ID: {order.id.slice(0, 8)}...</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{order.status}</span>
              </div>
              <p className="text-sm text-gray-500">Tanggal: {new Date(order.created_at * 1000).toLocaleDateString("id-ID")}</p>
              <p className="text-sm text-gray-500">Metode Pengiriman: {order.delivery_method.replace("_", " ")}</p>
              <p className="text-sm font-semibold mt-2">Total: Rp {order.final_total.toLocaleString("id-ID")}</p>
            </div>
            <div>
              <Link to={`/buyer/orders/${order.id}`}>
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
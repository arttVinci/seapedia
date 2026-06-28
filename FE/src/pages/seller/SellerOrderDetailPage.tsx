import { useParams, Link } from "react-router-dom";
import { useSellerOrderDetail } from "../../hooks/queries/seller/useSellerOrderDetail";
import { useProcessOrder } from "../../hooks/mutations/seller/useProcessOrder";
import { Card, Button } from "../../components/ui";
import OrderTimeline from "../../components/ui/OrderTimeline";

const SellerOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useSellerOrderDetail(id as string);
  const processMutation = useProcessOrder();

  if (isLoading) return <div className="p-4">Memuat detail pesanan...</div>;
  if (!order) return <div className="p-4">Pesanan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4">
        <Link to="/seller/orders">
          <Button variant="outline" className="text-sm">&larr; Kembali ke Daftar Pesanan</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Detail Pesanan #{order.id.slice(0, 8)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Item Pesanan</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold">Rp {(item.quantity * item.price).toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Timeline Status</h2>
            <OrderTimeline histories={order.status_histories} />
          </Card>
        </div>

        <div>
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pembayaran</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-Rp {order.discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp {order.delivery_fee.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN (12%)</span>
                <span>Rp {order.tax.toLocaleString("id-ID")}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Belanja</span>
                <span>Rp {order.final_total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </Card>

          {order.status === "Sedang Dikemas" && (
            <div className="mt-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => processMutation.mutate(id as string)}
                isLoading={processMutation.isPending}
              >
                Proses Pesanan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailPage;

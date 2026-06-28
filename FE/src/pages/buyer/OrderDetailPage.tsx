import { useParams, Link } from "react-router-dom";
import { useOrderDetail } from "../../hooks/queries/buyer/useOrderDetail";
import OrderTimeline from "../../components/ui/OrderTimeline";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, error } = useOrderDetail(
    id as string
  );

  if (isLoading) return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Gagal memuat detail pesanan: {error.message}</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">Pesanan tidak ditemukan.</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/buyer/orders"
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          &larr; Kembali ke Riwayat
        </Link>
      </div>

      <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-6">
        Detail Pesanan
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Item Pesanan
            </h2>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Timeline Status
            </h2>
            <OrderTimeline histories={order.status_histories} />
          </div>
        </div>

        {/* Right Column: Payment Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Ringkasan Pembayaran
            </h2>

            <ul className="flex flex-col">
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 first:rounded-t-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rp {order.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </li>
              {order.discount > 0 && (
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                  <div className="flex items-center justify-between w-full text-green-600">
                    <span className="text-sm">Diskon</span>
                    <span className="text-sm font-medium">
                      -Rp {order.discount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </li>
              )}
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-600">Ongkos Kirim</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rp {order.delivery_fee.toLocaleString("id-ID")}
                  </span>
                </div>
              </li>
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-600">PPN (12%)</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rp {order.tax.toLocaleString("id-ID")}
                  </span>
                </div>
              </li>
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0 last:rounded-b-lg font-semibold bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-900">Total Belanja</span>
                  <span className="text-base font-bold text-gray-900">
                    Rp {order.final_total.toLocaleString("id-ID")}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

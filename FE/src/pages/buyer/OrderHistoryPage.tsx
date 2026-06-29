import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../hooks/queries/buyer/useOrders";

const TABS = [
  "Semua",
  "Sedang Dikemas",
  "Menunggu Pengiriman",
  "Sedang Dikirim",
  "Pesanan Selesai",
  "Dibatalkan",
  "Refund",
];

const OrderHistoryPage = () => {
  const { data: orders, isLoading, isError, error } = useOrders();
  const [activeTab, setActiveTab] = useState("Semua");

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
        <p className="text-red-600">Gagal memuat pesanan: {error.message}</p>
      </div>
    </div>
  );

  if (!orders || orders.length === 0) return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-6">
        Riwayat Pesanan
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">Belum ada pesanan.</p>
        <Link
          to="/catalog"
          className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Mulai Belanja
        </Link>
      </div>
    </div>
  );

  const getStatusStyle = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "sedang dikemas") return "bg-yellow-100 text-yellow-800";
    if (lower === "menunggu pengiriman") return "bg-orange-100 text-orange-800";
    if (lower === "sedang dikirim") return "bg-blue-100 text-blue-800";
    if (lower === "pesanan selesai") return "bg-green-100 text-green-800";
    if (lower === "dibatalkan") return "bg-red-100 text-red-800";
    if (lower === "refund") return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders?.filter((order) => {
    if (activeTab === "Semua") return true;
    return order.status === activeTab;
  }) || [];

  return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-6">
        Riwayat Pesanan
      </h1>

      <div className="border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        <nav className="-mb-px flex space-x-6 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">Belum ada pesanan untuk kategori ini.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">
                      #{order.id.slice(0, 8)}...
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at * 1000).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.delivery_method.replace("_", " ")}
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    Rp {order.final_total.toLocaleString("id-ID")}
                  </p>
                </div>
                <Link
                  to={`/buyer/orders/${order.id}`}
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

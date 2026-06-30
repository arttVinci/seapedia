import { useState } from "react";
import { Link } from "react-router-dom";
import { useSellerOrders } from "../../hooks/queries/seller/useSellerOrders";

const TABS = [
  "Semua",
  "Pesanan Selesai",
  "Dibatalkan",
  "Dikembalikan",
];

const SellerOrderHistoryPage = () => {
  const { data: allOrders, isLoading, isError, error } = useSellerOrders();
  const [activeTab, setActiveTab] = useState("Semua");

  if (isLoading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  if (isError) return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-red-600">Gagal memuat pesanan: {error.message}</p>
    </div>
  );

  // Filter ONLY finished orders first
  const historyOrders = allOrders?.filter((order) => 
    ["Pesanan Selesai", "Dibatalkan", "Dikembalikan"].includes(order.status)
  ) || [];

  if (historyOrders.length === 0) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">Belum ada riwayat pesanan.</p>
      </div>
    </div>
  );

  const getStatusStyle = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "pesanan selesai") return "bg-green-100 text-green-800";
    if (lower === "dibatalkan") return "bg-red-100 text-red-800";
    if (lower === "dikembalikan") return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredOrders = historyOrders.filter((order) => {
    if (activeTab === "Semua") return true;
    return order.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

      <div className="border-b border-gray-200 mb-6 overflow-x-auto overflow-y-hidden hide-scrollbar">
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
            <p className="text-gray-500 text-lg">Belum ada riwayat pesanan untuk kategori ini.</p>
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
                    <Link to={`/seller/orders/${order.id}`} className="hover:underline">
                      <span className="text-sm font-semibold text-blue-700">
                        Order #{order.id.slice(0, 8)}
                      </span>
                    </Link>
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
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    Total: Rp {order.final_total.toLocaleString("id-ID")}
                  </p>
                </div>
                <Link
                  to={`/seller/orders/${order.id}`}
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerOrderHistoryPage;

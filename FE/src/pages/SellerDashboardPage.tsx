import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useSellerStore } from '../hooks/queries/stores/useSellerStore';
import { useSellerProducts } from '../hooks/queries/products/useSellerProducts';
import { useSellerOrders } from '../hooks/queries/seller/useSellerOrders';

export function SellerDashboardPage() {
  const { data: storeData } = useSellerStore();
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useSellerProducts({ page: 1, size: 1 });
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useSellerOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard Penjual
        {storeData?.name && (
          <span className="text-lg font-normal text-gray-500 ml-2">
            -- {storeData.name}
          </span>
        )}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-2xl font-bold text-gray-400">Memuat...</div>
            ) : productsError ? (
              <div className="text-sm text-red-500">Gagal memuat</div>
            ) : (
              <div className="text-2xl font-bold">{productsData?.total ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Masuk</CardTitle>
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
    </div>
  );
}

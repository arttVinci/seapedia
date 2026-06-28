import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/queries/buyer/useCart';
import { useUpdateCartItem } from '../../hooks/mutations/buyer/useUpdateCartItem';
import { useDeleteCartItem } from '../../hooks/mutations/buyer/useDeleteCartItem';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../@types/api/response.types';

export const CartPage: React.FC = () => {
  const { data: cart, isLoading, error } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();

  const [conflictError, setConflictError] = useState<string | null>(null);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateCartItemMutation.mutate(
      { id: itemId, payload: { quantity: newQuantity } },
      {
        onError: (err: AxiosError<ApiErrorResponse>) => {
          if (err.response?.status === 409) {
            setConflictError(err.response.data.message || 'Produk dari toko yang berbeda.');
          } else {
            alert(err.response?.data?.message || 'Gagal mengubah kuantitas.');
          }
        },
      }
    );
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm('Hapus produk ini dari keranjang?')) {
      deleteCartItemMutation.mutate(itemId, {
        onError: (err: AxiosError<ApiErrorResponse>) => {
          alert(err.response?.data?.message || 'Gagal menghapus produk.');
        },
      });
    }
  };

  const handleClearCart = () => {
    if (cart?.items) {
      Promise.all(cart.items.map(item => deleteCartItemMutation.mutateAsync(item.id)))
        .then(() => setConflictError(null))
        .catch(() => alert('Gagal mengosongkan keranjang.'));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500 py-10">
        Terjadi kesalahan saat memuat keranjang.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Keranjang Belanja</h1>

      {conflictError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-red-700 font-medium">Konflik Toko</p>
            <p className="text-red-600 text-sm">{conflictError}</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleClearCart}>
            Kosongkan Keranjang
          </Button>
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">Keranjang belanja Anda masih kosong.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                {/* Image Placeholder */}
                <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.product_name}</h3>
                  <p className="text-primary-600 font-medium mt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updateCartItemMutation.isPending}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-12 text-center py-1 border-x border-gray-300 focus:outline-none focus:ring-0"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updateCartItemMutation.isPending}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-red-500 hover:text-red-700 p-2"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={deleteCartItemMutation.isPending}
                    title="Hapus"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-600">Total Harga ({cart.total_items} barang)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(cart.total_price)}</p>
            </div>
            <Link to="/buyer/checkout">
              <Button size="lg" className="w-full sm:w-auto">
                Lanjutkan ke Pembayaran
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

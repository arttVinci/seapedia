import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/queries/buyer/useCart';
import { useUpdateCartItem } from '../../hooks/mutations/buyer/useUpdateCartItem';
import { useDeleteCartItem } from '../../hooks/mutations/buyer/useDeleteCartItem';
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

  const handleDeleteItem = (itemId: string) => {
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
      <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10 text-center text-red-500">
        Terjadi kesalahan saat memuat keranjang.
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-6">
          Keranjang Belanja
        </h1>
        <div className="text-center py-16 rounded-lg border border-gray-200 bg-white shadow-sm">
          <p className="text-gray-500 text-lg">Keranjang belanja Anda masih kosong.</p>
          <Link
            to="/catalog"
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.total_price ?? 0;
  const shipping = 0; // Will be calculated at checkout
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-6">
        Keranjang Belanja
      </h1>

      {conflictError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-red-700 font-medium">Konflik Toko</p>
            <p className="text-red-600 text-sm">{conflictError}</p>
          </div>
          <button
            onClick={handleClearCart}
            className="py-1.5 px-3 inline-flex items-center rounded-lg bg-red-600 text-xs font-medium text-white hover:bg-red-700"
          >
            Kosongkan Keranjang
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-md h-16 w-16 flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 text-md font-medium truncate">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-900 mt-1">
                      Rp{Number(item.price).toLocaleString('id-ID')} x {item.quantity}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updateCartItemMutation.isPending}
                      className="px-2.5 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updateCartItemMutation.isPending}
                      className="px-2.5 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={deleteCartItemMutation.isPending}
                      className="text-red-500 hover:text-red-700 ml-2 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            {cart.items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ringkasan Belanja
            </h2>

            <ul className="flex flex-col">
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 first:rounded-t-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-600">Sub Total</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rp{subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </li>
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-600">Pengiriman</span>
                  <span className="text-sm text-gray-500">
                    Dihitung saat checkout
                  </span>
                </div>
              </li>
              <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0 last:rounded-b-lg font-semibold">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-900">Total</span>
                  <span className="text-sm font-bold text-gray-900">
                    Rp{total.toLocaleString('id-ID')}
                  </span>
                </div>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-gray-500 text-center">
                {cart.total_items} barang dalam keranjang
              </p>
            </div>

            <Link to="/buyer/checkout">
              <button className="w-full mt-4 inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Lanjutkan ke Pembayaran
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

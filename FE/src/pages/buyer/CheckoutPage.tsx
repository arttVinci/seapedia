import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckoutPreview } from "../../hooks/mutations/buyer/useCheckoutPreview";
import { useCheckout } from "../../hooks/mutations/buyer/useCheckout";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkoutPreview = useCheckoutPreview();
  const checkout = useCheckout();

  const [deliveryMethod, setDeliveryMethod] = useState("regular");
  const [addressId, setAddressId] = useState("addr_123");
  const [voucherCode, setVoucherCode] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // Billing form fields
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingStreet, setBillingStreet] = useState("");
  const [billingCity, setBillingCity] = useState("");

  useEffect(() => {
    checkoutPreview.mutate({
      delivery_method: deliveryMethod,
      address_id: addressId,
      voucher_code: voucherCode || undefined,
      promo_code: promoCode || undefined,
    });
  }, [deliveryMethod, addressId]);

  const handleApplyDiscount = () => {
    checkoutPreview.mutate({
      delivery_method: deliveryMethod,
      address_id: addressId,
      voucher_code: voucherCode || undefined,
      promo_code: promoCode || undefined,
    });
  };

  const handleCheckout = () => {
    checkout.mutate(
      {
        delivery_method: deliveryMethod,
        address_id: addressId,
        voucher_code: voucherCode || undefined,
        promo_code: promoCode || undefined,
      },
      {
        onSuccess: () => {
          navigate("/buyer/orders");
        },
        onError: (err) => {
          alert(`Checkout failed: ${err.message}`);
        },
      }
    );
  };

  const summary = checkoutPreview.data;

  return (
    <div className="container mx-auto max-w-[85rem] w-full px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Billing Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Billing Contact */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Kontak Penagihan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  placeholder="Nama Anda"
                  className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    placeholder="08123456789"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Alamat Pengiriman
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Alamat Tersimpan
                </label>
                <select
                  value={addressId}
                  onChange={(e) => setAddressId(e.target.value)}
                  className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="addr_123">Rumah (Jl. Mawar No. 123)</option>
                  <option value="addr_456">Kantor (Jl. Sudirman No. 45)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Jalan
                </label>
                <input
                  type="text"
                  value={billingStreet}
                  onChange={(e) => setBillingStreet(e.target.value)}
                  placeholder="Jl. Contoh No. 123"
                  className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota
                </label>
                <input
                  type="text"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  placeholder="Jakarta"
                  className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Metode Pengiriman
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "instant", label: "Instant", desc: "2 Jam", price: "Rp 25.000" },
                { value: "next_day", label: "Next Day", desc: "1 Hari", price: "Rp 15.000" },
                { value: "regular", label: "Regular", desc: "3-5 Hari", price: "Rp 10.000" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    deliveryMethod === method.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_method"
                    value={method.value}
                    checked={deliveryMethod === method.value}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {method.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">{method.desc}</span>
                  <span className="text-sm font-medium text-gray-900 mt-2">
                    {method.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Kode Diskon (Opsional)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Masukkan kode voucher"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Masukkan kode promo"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleApplyDiscount}
                className="py-2.5 px-4 inline-flex items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Terapkan Diskon
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Ringkasan Pesanan
            </h2>

            {checkoutPreview.isPending ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-3">Menghitung...</p>
              </div>
            ) : summary ? (
              <ul className="flex flex-col">
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 first:rounded-t-lg">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rp {summary.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </li>
                {summary.discount > 0 && (
                  <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                    <div className="flex items-center justify-between w-full text-green-600">
                      <span className="text-sm">Total Diskon</span>
                      <span className="text-sm font-medium">
                        -Rp {summary.discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </li>
                )}
                {summary.promo_applied && (
                  <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                    <div className="flex items-center justify-between w-full text-green-600">
                      <span className="text-xs">Promo ({summary.promo_applied.code})</span>
                      <span className="text-xs font-medium">
                        -Rp {summary.promo_applied.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </li>
                )}
                {summary.voucher_applied && (
                  <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                    <div className="flex items-center justify-between w-full text-green-600">
                      <span className="text-xs">Voucher ({summary.voucher_applied.code})</span>
                      <span className="text-xs font-medium">
                        -Rp {summary.voucher_applied.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </li>
                )}
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-600">Dasar Pengenaan Pajak</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rp {summary.taxable.toLocaleString("id-ID")}
                    </span>
                  </div>
                </li>
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-600">PPN (12%)</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rp {summary.tax.toLocaleString("id-ID")}
                    </span>
                  </div>
                </li>
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-600">Ongkos Kirim</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rp {summary.delivery_fee.toLocaleString("id-ID")}
                    </span>
                  </div>
                </li>
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0 last:rounded-b-lg font-semibold bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-900">Total Belanja</span>
                    <span className="text-base font-bold text-gray-900">
                      Rp {summary.final_total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </li>
              </ul>
            ) : (
              <p className="text-red-500 text-sm text-center py-4">
                Gagal memuat ringkasan.
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkout.isPending || !summary}
              className="w-full mt-6 inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {checkout.isPending ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Memproses...
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

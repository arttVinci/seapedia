import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckoutPreview } from "../../hooks/mutations/buyer/useCheckoutPreview";
import { useCheckout } from "../../hooks/mutations/buyer/useCheckout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkoutPreview = useCheckoutPreview();
  const checkout = useCheckout();

  const [deliveryMethod, setDeliveryMethod] = useState("regular");
  const [addressId, setAddressId] = useState("addr_123"); // Mock address
  const [voucherCode, setVoucherCode] = useState("");
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    // Automatically fetch preview when delivery method or address changes
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
            <select
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="addr_123">Rumah (Jl. Mawar No. 123)</option>
              <option value="addr_456">Kantor (Jl. Sudirman No. 45)</option>
            </select>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Metode Pengiriman</h2>
            <div className="space-y-2">
              {["instant", "next_day", "regular"].map((method) => (
                <label key={method} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery_method"
                    value={method}
                    checked={deliveryMethod === method}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="form-radio"
                  />
                  <span className="capitalize">{method.replace("_", " ")}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Diskon (Opsional)</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Kode Voucher"
                />
                <Button onClick={handleApplyDiscount} variant="secondary">
                  Terapkan
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Kode Promo"
                />
                <Button onClick={handleApplyDiscount} variant="secondary">
                  Terapkan
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
            
            {checkoutPreview.isPending ? (
              <p>Menghitung...</p>
            ) : summary ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {summary.subtotal.toLocaleString("id-ID")}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Diskon</span>
                    <span>-Rp {summary.discount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                {summary.promo_applied && (
                  <div className="flex justify-between text-green-600 text-xs pl-2">
                    <span>Promo ({summary.promo_applied.code})</span>
                    <span>-Rp {summary.promo_applied.amount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                {summary.voucher_applied && (
                  <div className="flex justify-between text-green-600 text-xs pl-2">
                    <span>Voucher ({summary.voucher_applied.code})</span>
                    <span>-Rp {summary.voucher_applied.amount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Dasar Pengenaan Pajak</span>
                  <span>Rp {summary.taxable.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN (12%)</span>
                  <span>Rp {summary.tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>Rp {summary.delivery_fee.toLocaleString("id-ID")}</span>
                </div>
                
                <hr className="my-2" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Belanja</span>
                  <span>Rp {summary.final_total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-sm">Gagal memuat ringkasan. {checkoutPreview.error?.message}</p>
            )}

            <Button
              className="w-full mt-6"
              onClick={handleCheckout}
              disabled={checkout.isPending || !summary}
              isLoading={checkout.isPending}
            >
              Bayar Sekarang
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCheckoutPreview } from "../../hooks/mutations/buyer/useCheckoutPreview";
import { useCheckout } from "../../hooks/mutations/buyer/useCheckout";
import { useAddresses } from "../../hooks/queries/buyer/useAddresses";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkoutPreview = useCheckoutPreview();
  const checkout = useCheckout();
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();

  const [deliveryMethod, setDeliveryMethod] = useState("regular");
  const [addressId, setAddressId] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  // Billing form fields
  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingStreet, setBillingStreet] = useState("");

  useEffect(() => {
    if (addressId && addresses) {
      const selected = addresses.find((a) => a.id === addressId);
      if (selected) {
        setBillingName(selected.recipient);
        setBillingPhone(selected.phone);
        setBillingStreet(selected.full_address);
        // We can't autofill email or city properly from Address, so we leave it as is
      }
    }
  }, [addressId, addresses]);

  useEffect(() => {
    if (addressId) {
      checkoutPreview.mutate({
        delivery_method: deliveryMethod,
        address_id: addressId,
        discount_code: discountCode || undefined,
      });
    }
  }, [deliveryMethod, addressId]);

  const handleApplyDiscount = () => {
    if (!addressId) return toast.error("Silakan pilih alamat terlebih dahulu.");
    checkoutPreview.mutate(
      {
        delivery_method: deliveryMethod,
        address_id: addressId,
        discount_code: discountCode || undefined,
      },
      {
        onError: (err: any) => {
          toast.error(err.message || "Gagal menerapkan diskon.");
        },
      },
    );
  };

  const handleCheckout = () => {
    if (!addressId) {
      toast.error("Silakan pilih alamat pengiriman.");
      return;
    }
    checkout.mutate(
      {
        delivery_method: deliveryMethod,
        address_id: addressId,
        discount_code: discountCode || undefined,
      },
      {
        onSuccess: () => {
          navigate("/buyer/orders");
        },
        onError: (err) => {
          toast.error(`Checkout failed: ${err.message}`);
        },
      },
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
                <CustomSelect
                  value={addressId}
                  onChange={setAddressId}
                  placeholder="-- Pilih Alamat --"
                  disabled={isAddressesLoading}
                  options={addresses?.map(addr => ({
                    value: addr.id,
                    label: `${addr.label} - ${addr.recipient}`
                  })) || []}
                />
              </div>
              {addressId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Penerima
                    </label>
                    <div className="py-2.5 sm:py-3 px-4 block w-full bg-blue-50 text-gray-800 rounded-lg sm:text-sm border border-transparent">
                      {billingName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon
                    </label>
                    <div className="py-2.5 sm:py-3 px-4 block w-full bg-blue-50 text-gray-800 rounded-lg sm:text-sm border border-transparent">
                      {billingPhone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <div className="py-2.5 sm:py-3 px-4 block w-full bg-blue-50 text-gray-800 rounded-lg sm:text-sm border border-transparent">
                      {billingStreet}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shipping Method */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Metode Pengiriman
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  value: "instant",
                  label: "Instant",
                  desc: "2 Jam",
                  price: "Rp 25.000",
                },
                {
                  value: "next_day",
                  label: "Next Day",
                  desc: "1 Hari",
                  price: "Rp 15.000",
                },
                {
                  value: "regular",
                  label: "Regular",
                  desc: "3-5 Hari",
                  price: "Rp 10.000",
                },
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
                  <span className="text-xs text-gray-500 mt-1">
                    {method.desc}
                  </span>
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
                  Kode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Masukkan kode voucher atau promo"
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
                      <span className="text-xs">
                        Promo ({summary.promo_applied.code})
                      </span>
                      <span className="text-xs font-medium">
                        -Rp{" "}
                        {summary.promo_applied.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </li>
                )}
                {summary.voucher_applied && (
                  <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                    <div className="flex items-center justify-between w-full text-green-600">
                      <span className="text-xs">
                        Voucher ({summary.voucher_applied.code})
                      </span>
                      <span className="text-xs font-medium">
                        -Rp{" "}
                        {summary.voucher_applied.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </li>
                )}
                <li className="inline-flex items-center px-4 py-3 border border-gray-200 border-t-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-600">
                      Dasar Pengenaan Pajak
                    </span>
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
                Gagal memuat ringkasan.{" "}
                {!addressId && "Pilih alamat terlebih dahulu."}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkout.isPending || !summary || !addressId}
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

const CustomSelect = ({ value, onChange, options, placeholder, disabled }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="py-2.5 sm:py-3 px-4 flex items-center justify-between w-full border border-gray-200 bg-white rounded-lg sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-left"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${
                value === "" ? "bg-gray-50 text-gray-700 font-medium" : "text-gray-500"
              }`}
            >
              <span className="truncate">-- Pilih Alamat --</span>
              {value === "" && <Check className="w-4 h-4 text-gray-400" />}
            </li>
            {options.map((opt: any) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between ${
                  value === opt.value ? "bg-blue-50/50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {value === opt.value && <Check className="w-4 h-4 text-blue-600" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

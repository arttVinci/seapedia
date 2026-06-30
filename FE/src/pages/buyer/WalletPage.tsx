import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useWallet } from "../../hooks/queries/buyer/useWallet";
import { useWalletTopup } from "../../hooks/mutations/buyer/useWalletTopup";
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, CreditCard, Receipt, AlertCircle, Loader2 } from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getTransactionIcon = (type: string) => {
  if (["topup", "income", "refund"].includes(type.toLowerCase())) {
    return <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><ArrowDownRight className="w-5 h-5" /></div>;
  }
  return <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><ArrowUpRight className="w-5 h-5" /></div>;
};

const WalletPage: React.FC = () => {
  const { data: walletData, isLoading, isError } = useWallet();
  const { mutate: topup, isPending: isTopupPending } = useWalletTopup();

  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(100000);

  const handleTopup = () => {
    topup(
      { amount: topupAmount },
      {
        onSuccess: () => {
          setIsTopupModalOpen(false);
          setTopupAmount(100000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
        <div className="h-48 w-full bg-gray-200 animate-pulse rounded-3xl"></div>
        <div className="space-y-4 mt-8">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-rose-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Dompet</h2>
        <p className="text-gray-500 text-center max-w-md">Terjadi kesalahan saat memuat data dompet Anda. Silakan muat ulang halaman atau coba lagi nanti.</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>Muat Ulang</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
          <Wallet className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dompet Saya</h1>
      </div>

      {/* Wallet Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-xl shadow-blue-900/20 text-white p-8 md:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-100/80 mb-4">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium tracking-wide uppercase text-sm">Seapedia Pay</span>
            </div>
            <p className="text-sm font-medium text-blue-100">Total Saldo Aktif</p>
            <p className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {formatCurrency(walletData?.balance || 0)}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <button 
              onClick={() => setIsTopupModalOpen(true)}
              className="group relative flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-2xl font-bold hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Isi Saldo
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-6">
          <Receipt className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h2>
        </div>
        
        {(!walletData?.transactions || walletData.transactions.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-100 rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">Belum ada transaksi</p>
            <p className="text-gray-500 text-sm text-center">Transaksi top-up atau belanja Anda akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {walletData.transactions.map((trx) => {
              const isPositive = ["topup", "income", "refund"].includes(trx.type.toLowerCase());
              return (
                <div 
                  key={trx.id} 
                  className="group p-4 flex justify-between items-center bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all duration-300 hover:bg-blue-50/30"
                >
                  <div className="flex items-center gap-4">
                    {getTransactionIcon(trx.type)}
                    <div>
                      <p className="font-bold text-gray-900 capitalize group-hover:text-blue-900 transition-colors">{trx.type}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(trx.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {trx.description && (
                        <p className="text-sm text-gray-600 mt-1.5">{trx.description}</p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-lg font-extrabold ${
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isPositive ? "+" : "-"}
                    {formatCurrency(trx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Topup Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Konfirmasi Top Up</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Pilih nominal pengisian saldo simulasi (dummy) ke dompet Seapedia Pay Anda.
              </p>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-2">
                {[
                  50000, 100000, 200000, 
                  500000, 1000000, 2000000, 
                  5000000, 10000000, 20000000
                ].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount)}
                    className={`py-2 px-1 rounded-xl border text-sm font-bold transition-all ${
                      topupAmount === amount
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {amount >= 1000000 ? `${amount / 1000000} Jt` : `${amount / 1000} rb`}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center mb-8 border border-gray-100">
              <span className="text-sm font-bold text-gray-600">Total</span>
              <span className="text-2xl font-black text-blue-700 tracking-tight">{formatCurrency(topupAmount)}</span>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleTopup} 
                disabled={isTopupPending}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {isTopupPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : "Konfirmasi Top Up"}
              </button>
              <button
                onClick={() => setIsTopupModalOpen(false)}
                disabled={isTopupPending}
                className="w-full py-3.5 px-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-70"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;

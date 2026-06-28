import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useWallet } from "../../hooks/queries/buyer/useWallet";
import { useWalletTopup } from "../../hooks/mutations/buyer/useWalletTopup";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const WalletPage: React.FC = () => {
  const { data: walletData, isLoading, isError } = useWallet();
  const { mutate: topup, isPending: isTopupPending } = useWalletTopup();

  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  const handleTopup = () => {
    // Dummy amount as required
    topup(
      { amount: 100000 },
      {
        onSuccess: () => {
          setIsTopupModalOpen(false);
        },
      }
    );
  };

  if (isLoading) return <div className="p-4">Loading wallet...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load wallet data.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dompet Saya</h1>

      <Card className="p-6 bg-blue-50">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Saldo</p>
            <p className="text-3xl font-bold text-blue-700">
              {formatCurrency(walletData?.balance || 0)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setIsTopupModalOpen(true)}>
              Isi Saldo (Top Up)
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Riwayat Transaksi</h2>
        {(!walletData?.transactions || walletData.transactions.length === 0) ? (
          <p className="text-gray-500">Belum ada transaksi.</p>
        ) : (
          <div className="space-y-4">
            {walletData.transactions.map((trx) => (
              <Card key={trx.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold capitalize">{trx.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(trx.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {trx.description && (
                    <p className="text-sm text-gray-600 mt-1">{trx.description}</p>
                  )}
                </div>
                <div
                  className={`font-bold ${
                    trx.type === "topup" || trx.type === "income" || trx.type === "refund"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trx.type === "topup" || trx.type === "income" || trx.type === "refund"
                    ? "+"
                    : "-"}
                  {formatCurrency(trx.amount)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Top Up</h3>
            <p className="mb-6">
              Anda akan melakukan top up dummy sebesar <strong>{formatCurrency(100000)}</strong>.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsTopupModalOpen(false)}
                disabled={isTopupPending}
              >
                Batal
              </Button>
              <Button onClick={handleTopup} disabled={isTopupPending}>
                {isTopupPending ? "Memproses..." : "Konfirmasi"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;

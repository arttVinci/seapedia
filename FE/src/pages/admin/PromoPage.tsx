import React, { useState } from 'react';
import { usePromos } from '../../hooks/queries/admin/usePromos';
import { useCreatePromo } from '../../hooks/mutations/admin/useCreatePromo';
import type { CreatePromoPayload } from '../../@types/models';

export default function PromoPage() {
  const { data, isLoading } = usePromos();
  const createMutation = useCreatePromo();

  const [form, setForm] = useState<CreatePromoPayload>({
    code: '',
    discount_amount: 0,
    expired_at: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm({ ...form, code: '' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Promo</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Buat Promo Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kode</label>
            <input type="text" required value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Diskon (Rp)</label>
            <input type="number" required min={0} value={form.discount_amount} onChange={e => setForm({...form, discount_amount: Number(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expired At (UTC)</label>
            <input type="datetime-local" required value={new Date(form.expired_at * 1000).toISOString().slice(0, 16)} onChange={e => setForm({...form, expired_at: Math.floor(new Date(e.target.value).getTime() / 1000)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <button type="submit" disabled={createMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded">
            {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Daftar Promo</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diskon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expired</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map(v => (
                  <tr key={v.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{v.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Rp{v.discount_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(v.expired_at).toLocaleString()}</td>
                  </tr>
                ))}
                {data?.data?.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-4 text-center">Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

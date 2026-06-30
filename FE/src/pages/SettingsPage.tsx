import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUpdateProfile } from '../hooks/mutations/auth/useUpdateProfile';
import { Card, CardContent } from '../components/ui';

export function SettingsPage() {
  const { user } = useAuth();
  const updateMutation = useUpdateProfile();
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      username: form.username,
      email: form.email,
      ...(form.password && { password: form.password }),
    }, {
      onSuccess: () => {
        setForm(prev => ({ ...prev, password: '' })); // clear password after success
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text" 
                required 
                minLength={3}
                maxLength={50}
                value={form.username} 
                onChange={e => setForm({...form, username: e.target.value})} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                disabled={user?.auth_provider === 'google'}
              />
              {user?.auth_provider === 'google' && (
                <p className="text-xs text-gray-500 mt-1">Anda login menggunakan Google. Email tidak dapat diubah.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password Baru</label>
              <input 
                type="password" 
                minLength={6}
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                placeholder="Biarkan kosong jika tidak ingin mengubah password"
                disabled={user?.auth_provider === 'google'}
              />
            </div>

            <button 
              type="submit" 
              disabled={updateMutation.isPending || (user?.auth_provider === 'google' && form.username === user?.username)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors mt-6"
            >
              {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

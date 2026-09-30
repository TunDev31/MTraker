import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../lib/axios'
import { useWalletStore } from '@/stores/useWalletStore';

const WalletForm = ({ setWalletForm }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const fetchWallets = useWalletStore((state)=>state.fetchWallets);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên ví!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Gửi request tạo ví mới
      await api.post('/wallet', { 
        walletName: name.trim(), 
        remainAmount: Number(balance) || 0 
      });

      // Tắt modal sau khi tạo thành công
      setWalletForm(false);
      await fetchWallets();
    } catch (err) {
      console.error('Lỗi tạo ví:', err);
      setError(err.response?.data?.message || 'Không thể tạo ví, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-800">Thêm ví mới</h3>
          <button
            type="button"
            onClick={() => setWalletForm(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên ví
            </label>
            <input
              type="text"
              placeholder="VD: Tiền mặt, ATM, MoMo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số dư ban đầu
            </label>
            <input
              type="number"
              placeholder="0"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Nút bấm hành động */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setWalletForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--Green-color,#22c55e)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Đang tạo...' : 'Tạo ví'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletForm;
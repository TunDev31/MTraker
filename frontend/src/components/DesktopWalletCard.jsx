import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Plus,
  ArrowLeftRight,
  Banknote,
  Landmark,
  Wallet,
  CardSim,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWalletStore } from '@/stores/useWalletStore';
import { userStore } from '@/stores/useAuthStore';
import WalletTransferForm from '@/components/WalletTransferForm';
import { formatCurrency } from '@/utils/Format/formatCurrency';

// ── helpers ──────────────────────────────────────────────────────────────────

function getWalletIcon(walletName = '') {
  const lower = walletName.toLowerCase();
  if (lower.includes('mặt') || lower.includes('cash')) {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
        <Banknote className="h-5 w-5 text-green-600" />
      </span>
    );
  }
  if (lower.includes('momo')) {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
        <span className="text-sm font-bold text-orange-500">M</span>
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
      <Landmark className="h-5 w-5 text-blue-500" />
    </span>
  );
}

function getWalletDescription(walletName = '') {
  const lower = walletName.toLowerCase();
  if (lower.includes('tiền mặt') || lower.includes('tien mat')) return 'Chi tiêu tiền mặt hàng ngày';
  if (lower.includes('momo')) return 'Thanh toán trực tuyến & hóa đơn';
  return 'Tài khoản thanh toán';
}


// ── component ─────────────────────────────────────────────────────────────────

export default function DesktopWalletCard() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [openTransfer, setOpenTransfer] = useState(false);

  const wallets = useWalletStore((s) => s.wallets);
  const selectedWallet = useWalletStore((s) => s.selectedWallet);
  const changeWallet = useWalletStore((s) => s.changeWallet);
  const user = userStore((s) => s.user);

  const ownerName = user
    ? user.displayedName
    : 'NGUYEN VAN AN';

  const balance = selectedWallet?.remainAmount ?? 0;

  return (
    <>
      {/* Desktop only */}
      <aside className="hidden md:flex flex-col gap-5 w-full shrink-0 bg-white p-3 rounded-2xl shadow-xl ">
        {/* ── Header ── */}
        <div>
          <h2 className="text-base font-semibold text-gray-800">Thẻ Ví Hoạt Động</h2>
          <p className="text-xs text-gray-400 mt-0.5">Mặc định thanh toán</p>
        </div>

        {/* ── Credit Card Visual ── */}
        <div
          className="relative rounded-2xl p-5 text-white overflow-hidden shadow-lg select-none"
          style={{
            background:
              'radial-gradient(circle at 15% 10%, #143823 0%, #0a1a11 100%)',
            minHeight: '180px',
          }}
        >
          {/* decorative circles */}
          <span className="absolute -top-8 -right-8 h-36 w-36 rounded-full bg-white/5" />
          <span className="absolute -bottom-6 -right-4 h-24 w-24 rounded-full bg-white/5" />

          {/* Top row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-green-300 opacity-70">
              Money Manager
            </span>
            <CardSim className="h-6 w-6 text-yellow-400" />
          </div>

          {/* Card number */}
          <p className="mt-5 text-sm tracking-[0.25em] font-mono text-white/80">
            •••• •••• •••• 8920
          </p>

          {/* Balance */}
          <div className="mt-3 flex gap-2 flex-col">
             <p className="text-sm text-white/50 mt-0.5 block">Số dư khả dụng:</p>
            <div className='flex gap-2'>
              <span className="text-xl font-bold">
                {balanceVisible ? formatCurrency(balance,"vi-VN") : "*".repeat(String(balance).length)}
              </span>
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Toggle balance visibility"
              >
                {balanceVisible ? (
                  <Eye className="h-6 w-6" />
                ) : (
                  <EyeOff className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
         

          {/* Owner */}
          <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-white">
            {ownerName}
          </p>
        </div>

        {/* ── Action Buttons ── */}
        

        {/* ── Wallet List ── */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-3">
            Danh sách ví liên kết
          </p>

          <ul className="flex flex-col gap-1">
            {wallets && wallets.length > 0 ? (
              wallets.map((wallet) => {
                const isSelected = selectedWallet?._id === wallet._id;
                return (
                  <li key={wallet._id}>
                    <button
                      onClick={() => changeWallet(wallet._id)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                        isSelected
                          ? 'bg-green-50 ring-1 ring-green-200'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      {wallet.walletName ==="Tiền mặt" ? (<Banknote />) : (<Landmark />)}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {wallet.walletName}
                        </p>
                        
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-sm font-semibold text-gray-800">
                          {formatCurrency(wallet.remainAmount,"vi-VN")}
                        </span>
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            isSelected ? 'bg-green-500' : 'bg-gray-200'
                          )}
                        />
                      </div>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="flex flex-col items-center gap-2 py-8 text-gray-400">
                <Wallet className="h-8 w-8 opacity-30" />
                <p className="text-xs">Chưa có ví nào</p>
              </li>
            )}
          </ul>
        </div>
      </aside>

      {openTransfer && (
        <WalletTransferForm setWalletTransferForm={setOpenTransfer} />
      )}
    </>
  );
}

import { Plus } from 'lucide-react';
import React from 'react';

const NavBar = ({ setIsOpenForm, setWalletForm }) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto grid h-full max-w-lg grid-cols-2">
        {/* Nút 1: Thêm Chi Tiêu */}
        <button
          type="button"
          onClick={() => setIsOpenForm(true)}
          className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--Green-color,#22c55e)] text-white shadow-md">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 text-gray-600">Thêm thu chi</span>
        </button>

        {/* Nút 2: Thêm Ví */}
        <button
          type="button"
          onClick={() => setWalletForm(true)}
          className="inline-flex flex-col items-center justify-center font-medium px-5 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--Green-color,#22c55e)] text-white shadow-md">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 text-gray-600">Thêm ví</span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
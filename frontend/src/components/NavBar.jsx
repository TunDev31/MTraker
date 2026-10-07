import { Plus } from "lucide-react";
import React from "react";

const NavBar = ({ setIsOpenForm }) => {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white shadow-lg pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-3 items-center">
        {/* Cột trái: để trống, hoặc thêm một mục như "Trang chủ" */}
        <div />

        {/* Cột giữa: Thêm thu chi */}
        <button
          type="button"
          onClick={() => setIsOpenForm(true)}
          className="flex flex-col items-center justify-center justify-self-center px-3 py-1 text-gray-700 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00652C] text-white shadow-md">
            <Plus className="h-5 w-5" />
          </div>
          <span className="mt-1 text-xs font-medium text-[#0F172A]">
            Thêm thu chi
          </span>
        </button>

        {/* Cột phải: Cá nhân */}
        <button
          type="button"
          className="justify-self-center px-3 py-1 text-sm font-medium text-[#0F172A] transition-colors hover:bg-gray-50"
        >
          Cá nhân
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
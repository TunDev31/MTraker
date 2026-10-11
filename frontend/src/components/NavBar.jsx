import { cn } from "@/lib/utils";
import { House, Plus, User } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

const NavBar = ({ setIsOpenForm }) => {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full   border-gray-200 bg-white shadow-lg pb-[env(safe-area-inset-bottom)]">
      <div className="grid h-16 grid-cols-3 items-center p-2">
        {/* Cột trái: để trống, hoặc thêm một mục như "Trang chủ" */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex gap-0.5 flex-col items-center justify-center",
              isActive && " text-[#00652C] font-bold",

              !isActive && "text-[#0F172A] ",
            )
          }
        >
          <House />
          Home
        </NavLink>

        {/* Cột giữa: Thêm thu chi */}
       
          <button
            type="button"
            onClick={() => setIsOpenForm(true)}
            aria-label="Thêm giao dịch"
            className=" flex items-center justify-center rounded-full transition-colors "
          >
            <div className="  flex p-4 items-center justify-center rounded-full bg-[#00652C] text-white shadow-md">
              <Plus className="h-5 w-5 " />
            </div>
            
          </button>
        

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex gap-0.5 flex-col items-center justify-center",
              isActive && " text-[#00652C] font-bold",

              !isActive && "text-[#0F172A] ",
            )
          }
        >
          <User />
          Cá nhân
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;

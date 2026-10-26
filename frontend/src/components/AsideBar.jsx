import { cn } from "@/lib/utils";
import { userStore } from "@/stores/useAuthStore";
import {  LogOut, Maximize } from "lucide-react";
import {  useNavigate } from "react-router";
import logo from "../assets/logo.svg";
import { useState } from "react";
import { NAV_ITEMS } from "@/utils/temp/NavItem";
import AsideBarItem from "./AsideBarItem";

const AsideBar = () => {
  const { signOut } = userStore();
  const navigate = useNavigate();
  const [isExpand, setExpand] = useState(true);
  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <aside className="sticky top-0 md:flex flex-col max-h-dvh bg-white border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex justify-between items-center gap-1 px-2 py-2 border-b border-gray-100">
        {/* Icon "M" */}
        <div className="flex gap-0.5">
          <div className="flex items-center justify-between w-9 h-9 rounded-xl text-white font-bold text-lg select-none">
            <img src={logo} alt="" />
          </div>
          <div
            className={cn("flex flex-col leading-tight", !isExpand && "hidden")}
          >
            <span className="font-bold text-sm text-[#1a1a2e] tracking-tight">
              MTracker
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              Quản lý tài chính số
            </span>
          </div>
        </div>
      
        <button
          onClick={() => setExpand(!isExpand)}
          className={cn(
            "flex mr-2 hover:text-green-700 cursor-pointer",
            isExpand ? "hover:scale-75" : "hover:scale-125",
          )}
        >
          <Maximize size={16} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
        {NAV_ITEMS.map(({ label, icon: Icon, to, end, highlight, key }) => (
          <AsideBarItem key={key} label={label} icon={Icon}  to ={to} end= {end} highlight={highlight} isExpand={isExpand}/>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
        >
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className={cn("text-sm", !isExpand && "hidden")}>
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AsideBar;

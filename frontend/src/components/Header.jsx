import { userStore } from "@/stores/useAuthStore";
import { Bell, CircleDollarSign, CircleUserRound, SquareArrowRightExit } from "lucide-react";
import { useNavigate } from "react-router";

const Header = () => {
   const today = new Date();
  const {signOut} = userStore();
  const navigate = useNavigate();
  const handleLogOut = async ()=> {
      try {
        await signOut();
        navigate("/signin");
      } catch (error) {
        console.error("Loi khi dang xuat!");
      }
  }
  const formattedDate = today.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header
      className="flex w-full items-center justify-between  border-b-2
     border-b-black bg-white/80  backdrop-blur-md z-50 "
    >
      <div className="flex items-center gap-1 group cursor-pointer justify-center mb-2">
        <CircleDollarSign className="w-7 h-7 text-green-700 transition-transform group-hover:scale-105" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black bg-clip-text group-hover:scale-105 transition-transform">
            MTracker
          </h1>
           <p className="text-xs sm:text-sm font-medium">{formattedDate}</p>
        </div>
      </div>

      {/* KHU VỰC TÌM KIẾM & THÔNG BÁO */}
      <div className="flex items-center gap-1 justify-between flex-row">
        {/* <button className="relative p-2 shrink-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
          <Bell className="w-5 h-5 text-black" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950"></span>
        </button> */}
        {/* <CircleUserRound color="black" className="w-7 h-7" /> */}
        <button onClick={handleLogOut}>
          <SquareArrowRightExit />
        </button>
      </div>
    </header>
  );
};

export default Header;

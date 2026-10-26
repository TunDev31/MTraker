import NavBar from "@/components/NavBar";
import AsideBar from "@/components/AsideBar";
import SkeletonAsideBar from "@/components/SkeletonAsideBar";
import TransactionForm from "@/components/TransactionForm";
import { userStore } from "@/stores/useAuthStore";
import { Outlet } from "react-router";
import { useFormStore } from "@/stores/useFormStore";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function AppLayout() {
 
  const { loading } = userStore();
  const isMobile = useIsMobile();
  
const isOpen = useFormStore((s)=> s.isOpen)
  return (
    <div className="min-h-dvh flex flex-row bg-(--bg-primary)">
      {/* Sidebar – chỉ hiện trên md+ */}
      {!isMobile && (
        loading ? <SkeletonAsideBar /> : <AsideBar />
      )}
      {isMobile && <NavBar  />}
      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet  />
      </div>
  
      
      

      {isOpen && <TransactionForm  />}
    </div>
  );
}
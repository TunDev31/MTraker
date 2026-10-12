


import NavBar from "@/components/NavBar";

import TransactionForm from "@/components/TransactionForm";
import { useState } from "react";

import { Outlet } from "react-router";

export default function AppLayout() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  

  return (
    
    <div className="min-h-dvh flex flex-col pb-20 bg-(--bg-primary) justify-between">
      <Outlet />
     
      <NavBar setIsOpenForm={setIsOpenForm} />
      {isOpenForm && <TransactionForm setIsOpenForm={setIsOpenForm} />}
    </div>
  );
}
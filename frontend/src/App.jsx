import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { userStore } from "./stores/useAuthStore";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import ReportPage from "./pages/ReportPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AppLayout from "./components/layouts/AppLayout";
import PersonalPage from "./pages/PersonalPage";
import WalletPage from "./pages/WalletPage";


function App() {
  useEffect(() => {
    userStore.getState().initAuth();
  }, []);
  
  return (
    <>
      <Toaster /* giữ nguyên props hiện tại */ />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/profile" element={<PersonalPage />} />
              <Route path="/wallets" element={<WalletPage/>}> </Route>
            </Route>
          </Route>
        </Routes>


      </BrowserRouter>
    </>
  );
}

export default App;
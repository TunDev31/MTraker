import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import { toast, Toaster } from "sonner";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
function App() {
  return (
    <>
    <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: "#1c232b",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    <BrowserRouter>
    <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
         <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
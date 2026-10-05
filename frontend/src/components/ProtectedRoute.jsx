import { userStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router'
import logo from '@/assets/logo.svg'

const ProtectedRoute = () => {
  const accessToken = userStore((s) => s.accessToken)
  const loading = userStore((s) => s.loading)

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-(--bg-primary)">
        <p>Vui lòng đợi giây lát...</p>
        <img src={logo} alt="MTracker" className="h-12 w-auto animate-pulse" />
        <div className="h-8 w-8 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
      </div>
    )
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
import { userStore } from '@/stores/useAuthStore'

import React from 'react'
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
    const {accessToken,user, loading} = userStore();
    if (!accessToken) {
        return (
            <Navigate
            to="/signin" replace/>
        )
    }
  return (
    <Outlet>

    </Outlet>
  )
}

export default ProtectedRoute
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';

interface ProtectedRouteProps {
  reverse?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ reverse = false, redirectTo = '/' }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (reverse) {
    return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;

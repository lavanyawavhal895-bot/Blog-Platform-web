import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth initialization to prevent premature redirects
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse">Authenticating Session...</div>
      </div>
    );
  }

  // 2. If no token, force login. 
  // 'state' saves the path they wanted to visit so we can send them back later.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If a specific role is required and the user doesn't have it,
  // redirect to /dashboard to prevent "Forbidden" loops.
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Everything is fine, show the route content
  return <Outlet />;
};

export default ProtectedRoute;
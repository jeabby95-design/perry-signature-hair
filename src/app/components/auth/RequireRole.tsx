import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import type { UserRole } from "../../types/domain";
import { useAuth } from "../../firebase/auth-context";

interface RequireRoleProps {
  role: UserRole;
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { loading, user, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <Navigate
        to={`/auth?role=${role}&redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (profile.role !== role) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

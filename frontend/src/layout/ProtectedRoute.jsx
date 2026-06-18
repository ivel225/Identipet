import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

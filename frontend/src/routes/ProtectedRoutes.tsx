import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: any;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;

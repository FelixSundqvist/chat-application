import { Navigate, Outlet } from "react-router-dom";
import { useAuthToken } from "@/stores/auth.ts";
import { routes } from "../routes";

function ProtectedRoute() {
  const token = useAuthToken();

  if (!token) return <Navigate to={routes.signIn} />;

  return <Outlet />;
}

export default ProtectedRoute;

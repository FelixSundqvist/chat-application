import { Navigate, Outlet } from "react-router-dom";
import { useAuthToken } from "@/stores/auth.ts";
import { routes } from "../routes.ts";

function PublicRoute() {
  const token = useAuthToken();

  if (token) return <Navigate to={routes.chat} />;

  return <Outlet />;
}

export default PublicRoute;

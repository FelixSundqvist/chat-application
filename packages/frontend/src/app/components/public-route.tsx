import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../routes.ts";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";

function PublicRoute() {
  const { isAuthenticated } = useFirebaseAuth();
  if (isAuthenticated) return <Navigate to={routes.chat} />;
  return <Outlet />;
}

export default PublicRoute;

import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../routes.ts";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";

function ProtectedRoute() {
  const { isAuthenticated } = useFirebaseAuth();
  if (!isAuthenticated) return <Navigate to={routes.signIn} />;
  return <Outlet />;
}

export default ProtectedRoute;

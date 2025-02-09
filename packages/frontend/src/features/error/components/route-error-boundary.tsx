import { useRouteError } from "react-router-dom";
import GenericError from "@/features/error/components/generic-error.tsx";

function RouteErrorBoundary() {
  const error = useRouteError();

  console.error("RouteErrorBoundary: ", error);

  // Handle different types of errors here

  return <GenericError />;
}

export default RouteErrorBoundary;

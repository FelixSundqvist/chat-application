import GenericError from "@/features/error/components/generic-error.tsx";
import { useRouteError } from "react-router-dom";

function RouteErrorBoundary() {
  const error = useRouteError();

  console.error("RouteErrorBoundary: ", error);

  // NOTE: Handle different types of errors here

  return <GenericError />;
}

export default RouteErrorBoundary;

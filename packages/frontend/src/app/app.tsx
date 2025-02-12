import "./globals.css";
import { FirebaseAuthProvider } from "@/lib/firebase/auth.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router.tsx";
import ErrorBoundary from "@/features/error/components/error-boundary.tsx";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner.tsx";
import GenericError from "@/features/error/components/generic-error.tsx";
import { Toaster } from "sonner";

function App() {
  return (
    <ErrorBoundary fallback={<GenericError />}>
      <FirebaseAuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-dvh">
              <Spinner size="large" />
            </div>
          }
        >
          <RouterProvider router={router} />
          <Toaster />
        </Suspense>
      </FirebaseAuthProvider>
    </ErrorBoundary>
  );
}

export default App;

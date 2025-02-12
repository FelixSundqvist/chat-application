import { Button } from "@/components/ui/button.tsx";
import { signOut } from "@/lib/firebase/auth.tsx";

function GenericError() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <h1 className="font-bold text-2xl">Oooops... Something went wrong.</h1>
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}

export default GenericError;

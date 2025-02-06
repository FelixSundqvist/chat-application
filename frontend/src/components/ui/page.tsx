import { PropsWithChildren } from "react";

function Page({ children }: PropsWithChildren) {
  return (
    <div className="w-dvw h-dvh flex items-center justify-center bg-accent">
      <div className="p-2 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}

export default Page;

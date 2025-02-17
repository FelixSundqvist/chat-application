import type { PropsWithChildren } from "react";
import { cn } from "@/lib/style.ts";
import type { ClassValue } from "clsx";

function Page({
  children,
  className,
}: PropsWithChildren<{
  className?: ClassValue;
}>) {
  return (
    <div
      className={cn(
        "w-dvw h-dvh flex items-center justify-center bg-accent",
        className,
      )}
    >
      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}

export default Page;

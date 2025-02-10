import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useLatestValue<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function useLatestFn<
  TArgs,
  TReturn,
  TFunction extends (...args: TArgs[]) => TReturn,
>(fn: TFunction) {
  const ref = useRef(fn);
  ref.current = fn;
  return ref;
}

export default function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}

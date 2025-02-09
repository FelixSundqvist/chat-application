import { getFunctions, httpsCallable } from "firebase/functions";
import type { WithId } from "@shared/types";

const functions = getFunctions();

export async function getValuesFromFunction<T>(
  functionName: string,
): Promise<WithId<T>[]> {
  const fn = httpsCallable(functions, functionName);
  const result = await fn();
  return result.data as WithId<T>[];
}

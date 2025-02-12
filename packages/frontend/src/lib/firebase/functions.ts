import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

export async function callFirebaseFunction<T, TData>(
  functionName: string,
  data: TData,
) {
  const fn = httpsCallable(functions, functionName);
  const result = await fn(data);
  return result.data as T;
}

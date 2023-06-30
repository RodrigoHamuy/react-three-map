import { useCallback, useRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useFunction = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
};

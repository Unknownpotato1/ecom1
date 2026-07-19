"use client";

import { useSyncExternalStore } from "react";

// Returns true after the component has mounted on the client.
// Uses useSyncExternalStore to avoid SSR hydration mismatches and
// avoid the react-hooks/set-state-in-effect lint error.
const emptySubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

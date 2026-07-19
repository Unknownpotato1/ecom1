"use client";

import { useSyncExternalStore } from "react";

// Returns true after the component has mounted on the client.
// Uses useSyncExternalStore to avoid SSR hydration mismatches.
// IMPORTANT: getSnapshot and getServerSnapshot must return STABLE cached values
// (the same primitive reference) — otherwise React 19 detects an infinite update
// loop because it thinks the snapshot changes on every render.
const emptySubscribe = () => () => {};
const CLIENT_TRUE = true;
const SERVER_FALSE = false;

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => CLIENT_TRUE,
    () => SERVER_FALSE
  );
}

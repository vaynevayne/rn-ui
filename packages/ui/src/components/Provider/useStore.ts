import {
  UseBoundStoreWithEqualityFn,
  useStoreWithEqualityFn as useZustandStore,
} from "zustand/traditional";
import { useContext, useMemo } from "react";
import { StoreContext } from "./context";
import { GlobalState } from "./store";
import { StoreApi } from "zustand";
/**
 * 用于访问内部存储的钩子。应该只在极少数情况下使用。
 * @param selector
 * @param equalityFn
 * @returns
 */
function useStore<StateSlice = unknown>(
  selector: (state: GlobalState) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error("GlobalProvider 不可缺失");
  }

  return useZustandStore(store, selector, equalityFn);
}

function useStoreApi() {
  const store = useContext(StoreContext) as UseBoundStoreWithEqualityFn<
    StoreApi<GlobalState>
  > | null;

  if (store === null) {
    throw new Error("GlobalProvider 不可缺失");
  }

  return useMemo(
    () => ({
      getState: store.getState,
      setState: store.setState,
      subscribe: store.subscribe,
    }),
    [store]
  );
}

export { useStore, useStoreApi };

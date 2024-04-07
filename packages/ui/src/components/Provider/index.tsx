import { useRef, type ReactNode } from "react";
import { type StoreApi } from "zustand";
import { UseBoundStoreWithEqualityFn } from "zustand/traditional";
import { GlobalState, createGlobalStore } from "./store";
import { Provider } from "./context";

const GlobalProvider = ({
  children,
  components,
}: {
  children: ReactNode;
} & GlobalState) => {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<
    StoreApi<GlobalState>
  > | null>(null);
  if (!storeRef.current) {
    storeRef.current = createGlobalStore({
      components,
    });
  } else {
    // 处理嵌套Provider
    storeRef.current.setState({
      components,
    });
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export { GlobalProvider };

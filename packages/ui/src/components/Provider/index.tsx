import { useRef, type ReactNode } from "react";
import type { StoreApi } from "zustand";
import type { UseBoundStoreWithEqualityFn } from "zustand/traditional";
import { GlobalState, createGlobalStore } from "./store";
import { StoreContext } from "./context";
import { RootSiblingParent } from "react-native-root-siblings";

const Provider = ({
  children,
  components,
}: {
  children: ReactNode;
} & Partial<GlobalState>) => {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<
    StoreApi<GlobalState>
  > | null>(null);
  if (!storeRef.current) {
    storeRef.current = createGlobalStore({
      components: components ?? {},
    });
  } else {
    // 处理嵌套Provider
    storeRef.current.setState({
      components,
    });
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      <RootSiblingParent>{children}</RootSiblingParent>
    </StoreContext.Provider>
  );
};

export { Provider };

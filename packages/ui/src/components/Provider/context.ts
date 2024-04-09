import { createContext } from "react";
import type { createGlobalStore } from "./store";

const StoreContext = createContext<ReturnType<typeof createGlobalStore> | null>(
  null
);

export { StoreContext };

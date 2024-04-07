import { createContext } from "react";
import { createGlobalStore } from "./store";

const StoreContext = createContext<ReturnType<typeof createGlobalStore> | null>(
  null
);

const Provider = StoreContext.Provider;

export { StoreContext, Provider };

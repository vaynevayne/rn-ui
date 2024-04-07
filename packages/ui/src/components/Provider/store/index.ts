import { createWithEqualityFn } from "zustand/traditional";
import getInitialState from "./initialState";

export type GlobalState = {
  components: {
    [name: string]: {
      defaultProps: Record<string, any>;
    };
  };
};

const createGlobalStore = ({ components }: GlobalState) =>
  createWithEqualityFn<GlobalState>(
    (set, get) => ({
      ...getInitialState(),
      components,
      set,
      reset: () => set({ ...getInitialState() }),
    }),
    Object.is
  );

export { createGlobalStore };

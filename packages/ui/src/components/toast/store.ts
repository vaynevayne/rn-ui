import { create } from "zustand";
import type RootSiblingsManager from "react-native-root-siblings";

export interface ToastStore {
  rootSiblings: RootSiblingsManager | null;
}

export const useToastStore = create<ToastStore>()((set) => ({
  rootSiblings: null,
  set,
}));

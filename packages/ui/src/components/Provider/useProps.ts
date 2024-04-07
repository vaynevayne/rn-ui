import { GlobalState } from "./store";
import { useStore } from "./useStore";
import { shallow } from "zustand/shallow";

const globalStateSelector = (state: GlobalState) => ({
  components: state.components,
});

export function useProps<
  T extends Record<string, any>,
  U extends Partial<T> = {},
>(
  component: string,
  defaultProps: U,
  props: T
): T & {
  [Key in Extract<keyof T, keyof U>]-?: U[Key] | NonNullable<T[Key]>;
} {
  const globalState = useStore(globalStateSelector, shallow);
  const contextPropsPayload = globalState.components[component]?.defaultProps;
  const contextProps =
    typeof contextPropsPayload === "function"
      ? contextPropsPayload(globalState)
      : contextPropsPayload;

  return { ...defaultProps, ...contextProps, ...props };
}

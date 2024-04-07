const getInitialState = () => {
  return {
    theme: "light",
    components: {} as {
      [name: string]: {
        defaultProps: Record<string, any>;
      };
    },
  };
};

export default getInitialState;

interface AsyncExtend {
  loading: boolean;
  error: null | string;
}

export const createAsyncAction = <S extends AsyncExtend>(
  set: (state: Partial<S>) => void,
  get: () => S,
) => {
  return <R, P>(
      action: (queryParam: P, get: () => S) => Promise<R>,
      options?: {
        onSuccess?: (
          data: R,
          set: (state: Partial<S>) => void,
          get: () => S,
        ) => void;
        onError?: (error: string, set: (state: Partial<S>) => void) => void;
      },
    ) =>
    async (params?: P) => {
      set({ loading: true, error: null } as Partial<S>);

      try {
        const data = await action(params as P, get);
        if (options?.onSuccess) {
          options.onSuccess(data, set, get);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (options?.onError) {
          options.onError(msg, set);
        } else {
          set({ error: msg } as Partial<S>);
        }
      } finally {
        set({ loading: false } as Partial<S>);
      }
    };
};

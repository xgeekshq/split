import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions } from '@testing-library/react';
import { ReactNode, useEffect } from 'react';
import { RecoilRoot, RecoilState, useRecoilValue } from 'recoil';

type RecoilOptions = {
  recoilHandler: (value: any) => void;
  recoilState: RecoilState<any>;
};

export type RenderHookWithProvidersOptions = Omit<RenderOptions, 'queries'> & {
  queryClient?: QueryClient;
  recoilOptions?: RecoilOptions;
};

export type WrapperProps = {
  children: ReactNode;
  queryClient: QueryClient;
  recoilHandler?: (value: any) => void;
  recoilState?: RecoilState<any>;
};

const RecoilObserver = ({ recoilState, recoilHandler }: RecoilOptions) => {
  const value = useRecoilValue(recoilState);
  useEffect(() => recoilHandler(value), [recoilHandler, value]);
  return null;
};

export function createWrapper({ children, queryClient, recoilHandler, recoilState }: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        {recoilHandler && recoilState && (
          <RecoilObserver recoilState={recoilState} recoilHandler={recoilHandler} />
        )}
        {children}
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export function renderHookWithProviders(options?: Partial<RenderHookWithProvidersOptions>) {
  const defaultQueryOptions = {
    defaultOptions: {
      queries: { retry: false },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  };
  const queryClient = options?.queryClient ?? new QueryClient(defaultQueryOptions);
  const recoilHandler = options?.recoilOptions?.recoilHandler;
  const recoilState = options?.recoilOptions?.recoilState;

  return ({ children }: { children: ReactNode }) =>
    createWrapper({ children, queryClient, recoilHandler, recoilState });
}

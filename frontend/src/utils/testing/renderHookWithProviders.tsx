import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions } from '@testing-library/react';
import { RecoilRoot, RecoilState } from 'recoil';

import RecoilObserver, { RecoilOptions } from '@utils/testing/recoilObserver';

export type RenderHookWithProvidersOptions = Omit<RenderOptions, 'queries'> & {
  queryClient?: QueryClient;
  recoilOptions?: RecoilOptions;
};

type WrapperProps = {
  children: ReactNode;
  queryClient: QueryClient;
  recoilHandler?: (value: any) => void;
  recoilState?: RecoilState<any>;
};

function createWrapper({ children, queryClient, recoilHandler, recoilState }: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        {recoilHandler && recoilState && (
          <RecoilObserver recoilHandler={recoilHandler} recoilState={recoilState} />
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

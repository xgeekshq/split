import { ReactElement, ReactNode } from 'react';
import { Session } from 'next-auth';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { RecoilRoot, RecoilState } from 'recoil';

import { User } from '@/types/user/user';
import { createMockRouter, createMockSession } from '@/utils/testing/mocks';
import RecoilObserver, { RecoilOptions } from '@utils/testing/recoilObserver';

export type RenderWithProvidersOptions = Omit<RenderOptions, 'queries'> & {
  routerOptions?: Partial<NextRouter>;
  queryClient?: QueryClient;
  sessionOptions?: {
    session?: Session;
    user?: User;
  };
  recoilOptions?: { initialState?: any } & RecoilOptions;
};

export type WrapperProps = {
  children: ReactNode;
  router: NextRouter;
  queryClient: QueryClient;
  session: Session;
  recoilHandler?: (value: any) => void;
  recoilState?: RecoilState<any>;
  initialRecoilState?: any;
};

export function createWrapper({
  children,
  router,
  session,
  queryClient,
  recoilHandler,
  recoilState,
  initialRecoilState,
}: WrapperProps) {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  return (
    <RouterContext.Provider value={router}>
      <SessionProvider refetchInterval={300} session={session}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot initializeState={initialRecoilState}>
            {recoilHandler && recoilState && (
              <RecoilObserver recoilHandler={recoilHandler} recoilState={recoilState} />
            )}
            {children}
          </RecoilRoot>
        </QueryClientProvider>
      </SessionProvider>
    </RouterContext.Provider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions,
): RenderResult {
  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => {
      const router = createMockRouter(options?.routerOptions);

      const defaultQueryOptions = {
        defaultOptions: {
          queries: { retry: false },
        },
      };
      const queryClient = options?.queryClient ?? new QueryClient(defaultQueryOptions);
      const session = createMockSession(
        options?.sessionOptions?.session,
        options?.sessionOptions?.user,
      );
      const recoilHandler = options?.recoilOptions?.recoilHandler;
      const recoilState = options?.recoilOptions?.recoilState;
      const initialRecoilState = options?.recoilOptions?.initialState;

      return createWrapper({
        children,
        router,
        queryClient,
        session,
        recoilHandler,
        recoilState,
        initialRecoilState,
      });
    },
    ...options,
  });
}

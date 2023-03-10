import { User } from '@/types/user/user';
import { createMockRouter, createMockSession } from '@/utils/testing/mocks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { ReactElement, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

export type RenderWithProvidersOptions = Omit<RenderOptions, 'queries'> & {
  routerOptions?: Partial<NextRouter>;
  queryClient?: QueryClient;
  sessionOptions?: {
    session?: Session;
    user?: User;
  };
};

export type WrapperProps = {
  children: ReactNode;
  router: NextRouter;
  queryClient: QueryClient;
  session: Session;
};

export function createWrapper({ children, router, session, queryClient }: WrapperProps) {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  return (
    <RouterContext.Provider value={router}>
      <SessionProvider refetchInterval={300} session={session}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>{children}</RecoilRoot>
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
      const queryClient = options?.queryClient ?? new QueryClient();
      const session = createMockSession(
        options?.sessionOptions?.session,
        options?.sessionOptions?.user,
      );

      return createWrapper({ children, router, queryClient, session });
    },
    ...options,
  });
}

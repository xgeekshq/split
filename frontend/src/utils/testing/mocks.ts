import { User } from '@/types/user/user';
import { Session } from 'next-auth/core/types';
import * as NextRouter from 'next/router';
import * as ReactQuery from '@tanstack/react-query';
import { SessionUserFactory } from '@/utils/factories/user';

export type MockReactQueryOptions = {
  useQueryResult: Partial<ReactQuery.UseQueryResult>;
  useInfiniteQueryResult: Partial<ReactQuery.UseInfiniteQueryResult>;
  useMutationResult: Partial<ReactQuery.UseMutationResult>;
};

export function createMockRouter(router?: Partial<NextRouter.NextRouter>): NextRouter.NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(true),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    forward: jest.fn(),
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    locale: 'en',
    locales: ['en'],
    ...router,
  };
}

export const libraryMocks = {
  mockNextRouter(router?: Partial<NextRouter.NextRouter>) {
    const mockRouter = createMockRouter(router);
    const useRouterMockFn = jest.fn(() => mockRouter);

    jest.spyOn(NextRouter, 'useRouter').mockImplementation(useRouterMockFn);

    return {
      ...this,
      mockRouter,
      useRouterMockFn,
    };
  },
  
  mockReactQuery(options?: Partial<MockReactQueryOptions>) {
    const { useQueryResult, useInfiniteQueryResult, useMutationResult } = options ?? {};
    
    const useQueryMockFn = jest.fn<Partial<ReactQuery.UseQueryResult>, any>(() => ({
      ...useQueryResult,
    }));
    const useInfiniteQueryMockFn = jest.fn<Partial<ReactQuery.UseInfiniteQueryResult>, any>(() => ({
      ...useInfiniteQueryResult,
    }));
    const useMutationMockFn = jest.fn<Partial<ReactQuery.UseMutationResult>, any>(() => ({
      ...useMutationResult,
    }));

    jest.spyOn(ReactQuery, 'useQuery').mockImplementation(useQueryMockFn as any);
    jest.spyOn(ReactQuery, 'useInfiniteQuery').mockImplementation(useInfiniteQueryMockFn as any);
    jest.spyOn(ReactQuery, 'useMutation').mockImplementation(useMutationMockFn as any);

    return {
      ...this,
      useQueryMockFn,
      useMutationMockFn,
    };
  },
};

export function createMockSession(session?: Partial<Session>, user?: User): Session {
  return {
    user: SessionUserFactory.create({ ...user, id: user?._id, isSAdmin: user?.isSAdmin ?? false }),
    expires: new Date().toISOString(),
    strategy: 'local',
    error: '',
    ...session,
  };
}

export function createMockResizeObserver() {
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
}

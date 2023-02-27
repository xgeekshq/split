import { Session } from 'next-auth/core/types';
import { NextRouter } from 'next/router';
import { SessionUserFactory } from '../factories/user';

export function createMockRouter(router?: Partial<NextRouter>): NextRouter {
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

export function createMockSession(): Session {
  return {
    user: SessionUserFactory.create(),
    expires: new Date().toISOString(),
    strategy: 'local',
    error: '',
  };
}

/* eslint-disable */
// @ts-nocheck
import { ReactElement, ReactNode, useEffect } from 'react';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NextPage } from 'next';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';

import globalStyles from '@/styles/globals';

import Sprite from '@/components/icons/Sprite';
import Toast, { ToastProvider, ToastViewport } from '@/components/Primitives/Toast';
import { JWT_EXPIRATION_TIME } from '@/utils/constants';
import { ROUTES } from '@/utils/routes';
import { Session } from 'next-auth';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RecoilDevTools from '@/components/RecoilDevTools/RecoilDevTools';

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextPageWithLayout<P>;
};

function Root({
  Component,
  pageProps,
}: AppPropsWithLayout<{ session: Session; dehydratedState: DehydratedState }>): JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        suspense: false,
      },
    },
  });

  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();
  globalStyles();

  useEffect(() => {
    (function (m, a, z, e) {
      let s;
      let t;
      try {
        t = m.sessionStorage.getItem('maze-us');
      } catch (err) {}

      if (!t) {
        t = new Date().getTime();
        try {
          m.sessionStorage.setItem('maze-us', String(t));
        } catch (err) {}
      }

      s = a.createElement('script');
      s.src = z + '?t=' + t + '&apiKey=' + e;
      s.async = true;
      a.getElementsByTagName('head')[0].appendChild(s);
      m.mazeUniversalSnippetApiKey = e;
    })(
      window,
      document,
      'https://snippet.maze.co/maze-universal-loader.js',
      '3023cbc3-dd28-4294-9b9f-154ca2b3e7b0',
    );
  });

  return (
    <>
      <Head>
        <title>SPLIT</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </Head>
      <Sprite />
      <SessionProvider refetchInterval={JWT_EXPIRATION_TIME - 5} session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ToastProvider duration={7000}>
              <RecoilRoot>
                {getLayout(<Component {...pageProps} />)}
                <Toast />
                <RecoilDevTools />
              </RecoilRoot>
              <ToastViewport
                css={{
                  left: router.asPath === ROUTES.START_PAGE_ROUTE ? '0' : 'none',
                  right: router.asPath === ROUTES.START_PAGE_ROUTE ? 'none' : 0,
                  top: router.asPath === ROUTES.START_PAGE_ROUTE ? 'calc(10% + 60px)' : '$106',
                  paddingRight: router.asPath === ROUTES.START_PAGE_ROUTE ? 0 : 56,
                  paddingLeft: router.asPath === ROUTES.START_PAGE_ROUTE ? '$72' : 0,
                }}
              />
            </ToastProvider>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

Root.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default Root;

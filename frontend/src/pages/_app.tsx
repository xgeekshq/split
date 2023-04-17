import { ReactElement, ReactNode, useState } from 'react';
import { NextPage } from 'next';
import { Session } from 'next-auth';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';

import Sprite from '@/components/icons/Sprite';
import Toast, { ToastProvider, ToastViewport } from '@/components/Primitives/Toast/Toast';
import RecoilDevTools from '@/components/RecoilDevTools/RecoilDevTools';
import globalStyles from '@/styles/globals';
import { JWT_EXPIRATION_TIME, RECOIL_DEV_TOOLS } from '@/utils/constants';
import { ROUTES } from '@/utils/routes';

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextPageWithLayout<P>;
};

const QUERY_OPTIONS: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      suspense: false,
    },
  },
};

globalStyles();

function Root({
  Component,
  pageProps,
}: AppPropsWithLayout<{ session: Session; dehydratedState: DehydratedState }>): JSX.Element {
  const [queryClient] = useState(() => new QueryClient(QUERY_OPTIONS));

  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();

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
                {RECOIL_DEV_TOOLS && <RecoilDevTools />}
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

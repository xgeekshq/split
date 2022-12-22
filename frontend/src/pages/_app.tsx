import { ReactElement, ReactNode } from 'react';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
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
              </RecoilRoot>
              <ToastViewport
                css={{
                  paddingRight: router.asPath === ROUTES.START_PAGE_ROUTE ? 162 : 56,
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

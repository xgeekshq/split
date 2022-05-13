import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { NextPage } from "next";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";
import globalStyles from "../styles/globals";
import { JWT_EXPIRATION_TIME } from "../utils/constants";
import Toast, { ToastProvider, ToastViewport } from "../components/Primitives/Toast";
import { ROUTES } from "../utils/routes";
import Sprite from "../components/icons/Sprite";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout): JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        suspense: true,
      },
    },
  });

  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();
  globalStyles();
  return (
    <>
      <Head>
        <title>Divide & Conquer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Sprite />
      <SessionProvider session={session} refetchInterval={JWT_EXPIRATION_TIME - 5}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ToastProvider duration={100000}>
              <RecoilRoot>
                {getLayout(<Component {...pageProps} />)}
                <Toast />
              </RecoilRoot>
              <ToastViewport
                css={{ paddingRight: router.asPath === ROUTES.START_PAGE_ROUTE ? 162 : 56 }}
              />
            </ToastProvider>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default App;

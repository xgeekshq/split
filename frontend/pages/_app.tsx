import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import { Hydrate } from "react-query/hydration";
import { Provider } from "react-redux";
import Head from "next/head";
import globalStyles from "../styles/globals";
import store from "../store/store";
import { JWT_EXPIRATION_TIME } from "../utils/constants";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient());

  globalStyles();
  return (
    <>
      <Head>
        <title>Divide & Conquer</title>
      </Head>
      <SessionProvider session={session} refetchInterval={JWT_EXPIRATION_TIME - 5}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default App;

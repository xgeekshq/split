import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";
import Head from "next/head";
import { IdProvider } from "@radix-ui/react-id";
import globalStyles from "../styles/globals";
import Layout from "../components/Layout/Layout";
import { StoreProvider } from "../store/store";

function App({ Component, pageProps }: AppProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient());

  globalStyles();

  return (
    <IdProvider>
      <Head>
        <title>Divide & Conquer</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <StoreProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </StoreProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </IdProvider>
  );
}

export default App;

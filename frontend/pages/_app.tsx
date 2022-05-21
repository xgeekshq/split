import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { ReactElement, ReactNode } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecoilRoot } from 'recoil';

import Sprite from '../components/icons/Sprite';
import Toast, { ToastProvider, ToastViewport } from '../components/Primitives/Toast';
import globalStyles from '../styles/globals';
import { JWT_EXPIRATION_TIME } from '../utils/constants';
import { ROUTES } from '../utils/routes';

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
				suspense: true
			}
		}
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
								css={{
									paddingRight:
										router.asPath === ROUTES.START_PAGE_ROUTE ? 162 : 56
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

export default App;

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import { START_PAGE_ROUTE } from 'utils/routes';

function requireAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		const session = await getSession(ctx);
		if (!session) {
			return {
				redirect: {
					destination: START_PAGE_ROUTE,
					permanent: true
				}
			};
		}

		return gssp(ctx);
	};
}

export default requireAuthentication;

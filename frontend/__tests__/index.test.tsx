/* eslint-disable simple-import-sort/imports */
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages/index';

const queryClient = new QueryClient();

export const Wrapper: React.FC = ({ children }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Landing page', () => {
	it('renders a div', () => {
		render(
			<Wrapper>
				<Home />
			</Wrapper>
		);
	});
});

import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { render, screen } from '@testing-library/react';
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

		const span = screen.getByText('Log In');

		expect(span).toBeInTheDocument();
	});
});

import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Home from '../pages';

const queryClient = new QueryClient();

export const Wrapper: React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>{children}</RecoilRoot>
  </QueryClientProvider>
);

describe('Landing page', () => {
  it('renders a div', () => {
    render(
      <Wrapper>
        <Home />
      </Wrapper>,
    );
  });
});

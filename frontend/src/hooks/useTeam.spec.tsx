import { renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import { createMockRouter, createMockSession, libraryMocks } from '@/utils/testing/mocks';
import { QueryClient } from '@tanstack/react-query';
import { createWrapper } from '@/utils/testing/renderWithProviders';
import useTeam from './useTeam';

const { useQueryMockFn } = libraryMocks.mockReactQuery();

const wrapper = ({ children }: { children: ReactNode }) => {
  const router = createMockRouter();
  const queryClient = new QueryClient();
  const session = createMockSession();

  return createWrapper({ children, router, queryClient, session });
};

describe('Hooks/useTeam', () => {
  it('allows you to fetchAllTeams', async () => {
    renderHook(() => useTeam(), { wrapper });

    expect(useQueryMockFn).toBeCalled();
  });
});

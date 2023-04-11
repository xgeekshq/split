import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import Users from '@/pages/users';
import { libraryMocks } from '@/utils/testing/mocks';
import useUsersWithTeams from '@/hooks/users/useUsersWithTeams';
import { UseInfiniteQueryResult } from '@tanstack/react-query';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const mockUseUsersWithTeams = useUsersWithTeams as jest.Mock<Partial<UseInfiniteQueryResult>>;
jest.mock('@/hooks/users/useUsersWithTeams');

const render = () => renderWithProviders(<Users />, { routerOptions: mockRouter });

describe('Pages/Users', () => {
  beforeEach(() => {
    mockUseUsersWithTeams.mockReturnValue({
      status: 'loading',
    } as Partial<UseInfiniteQueryResult>);
  });

  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('usersList')).toBeInTheDocument();
  });

  it.todo('should prefetch on getServerSide');
});

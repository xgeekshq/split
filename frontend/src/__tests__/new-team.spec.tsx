import { UseQueryResult } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';

import useUsers from '@/hooks/users/useUsers';
import NewTeam from '@/pages/teams/new';
import { User } from '@/types/user/user';
import { UserFactory } from '@/utils/factories/user';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const mockUseUsers = useUsers as jest.Mock<UseQueryResult<User[]>>;
jest.mock('@/hooks/users/useUsers');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams/new' });

const render = () => renderWithProviders(<NewTeam />, { routerOptions: mockRouter });

describe('Pages/Teams/[teamId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseUsers.mockReturnValue({
      data: UserFactory.createMany(10),
    } as UseQueryResult<User[]>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('createTeam')).toBeInTheDocument();
  });

  it('should redirect when no data is fetched', async () => {
    // Arrange
    mockUseUsers.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<User[]>);

    render();

    // Assert
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.Teams);
    });
  });

  it.todo('should prefetch on getServerSide');
});

import { waitFor } from '@testing-library/react';

import { ROUTES } from '@/constants/routes';
import useUsers from '@/hooks/users/useUsers';
import NewTeam from '@/pages/teams/new';
import { UseUsersQueryReturnType } from '@/types/hooks/users/useUsersQueryReturnType';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const mockUseUsers = useUsers as jest.Mock<Partial<UseUsersQueryReturnType>>;
jest.mock('@/hooks/users/useUsers');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams/new' });

const render = () => renderWithProviders(<NewTeam />, { routerOptions: mockRouter });

describe('Pages/Teams/[teamId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseUsers.mockReturnValue({
      fetchAllUsers: {
        data: UserFactory.createMany(10),
      },
    } as Partial<UseUsersQueryReturnType>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('createTeam')).toBeInTheDocument();
  });

  it('should redirect when no data is fetched', async () => {
    // Arrange
    mockUseUsers.mockReturnValue({
      fetchAllUsers: {
        isLoading: true,
      },
    } as Partial<UseUsersQueryReturnType>);

    render();

    // Assert
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.Teams);
    });
  });

  it.todo('should prefetch on getServerSide');
});

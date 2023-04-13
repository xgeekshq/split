import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import UserDetails from '@/pages/users/[userId]';
import { libraryMocks } from '@/utils/testing/mocks';
import useUser from '@/hooks/users/useUser';
import { UseQueryResult } from '@tanstack/react-query';
import { User } from '@/types/user/user';
import useUserTeams from '@/hooks/teams/useUserTeams';
import { Team } from '@/types/team/team';
import { UserFactory } from '@/utils/factories/user';
import { TeamFactory } from '@/utils/factories/team';
import { waitFor } from '@testing-library/react';
import { ROUTES } from '@/utils/routes';

const randomUser = UserFactory.create();
const mockUseUser = useUser as jest.Mock<UseQueryResult<User>>;
jest.mock('@/hooks/users/useUser');

const mockUseUserTeams = useUserTeams as jest.Mock<UseQueryResult<Team[]>>;
jest.mock('@/hooks/teams/useUserTeams');

const { mockRouter } = libraryMocks.mockNextRouter({
  pathname: `/users/${randomUser._id}`,
  query: { userId: randomUser._id },
});

const render = () => renderWithProviders(<UserDetails />, { routerOptions: mockRouter });

describe('Pages/Users/[userId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseUser.mockReturnValue({
      data: UserFactory.create(),
    } as UseQueryResult<User>);

    mockUseUserTeams.mockReturnValue({
      data: TeamFactory.createMany(10),
    } as UseQueryResult<Team[]>);

    // Act
    const { getByTestId, getAllByTestId } = render();

    // Assert
    expect(getByTestId('userHeader')).toBeInTheDocument();
    expect(getByTestId('teamsList')).toBeInTheDocument();

    expect(getAllByTestId('teamItem')).toHaveLength(10);
  });

  it('should redirect when no data is fetched', async () => {
    // Arrange
    mockUseUser.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<User>);

    mockUseUserTeams.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<Team[]>);

    // Act
    render();

    // Assert
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.Users);
    });
  });

  it.todo('should prefetch on getServerSide');
});
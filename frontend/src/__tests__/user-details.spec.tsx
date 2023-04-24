import { UseQueryResult } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';

import { ROUTES } from '@/constants/routes';
import useTeamsWithoutUser from '@/hooks/teams/useTeamsWithoutUser';
import useUserTeams from '@/hooks/teams/useUserTeams';
import useUser from '@/hooks/users/useUser';
import UserDetails from '@/pages/users/[userId]';
import { Team } from '@/types/team/team';
import { User } from '@/types/user/user';
import { TeamCheckedFactory, TeamFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const randomUser = UserFactory.create();
const mockUseUser = useUser as jest.Mock<UseQueryResult<User>>;
jest.mock('@/hooks/users/useUser');

const mockUseUserTeams = useUserTeams as jest.Mock<UseQueryResult<Team[]>>;
jest.mock('@/hooks/teams/useUserTeams');

const mockUseTeamsWithoutUser = useTeamsWithoutUser as jest.Mock<Partial<UseQueryResult>>;
jest.mock('@/hooks/teams/useTeamsWithoutUser');

const { mockRouter } = libraryMocks.mockNextRouter({
  pathname: `/users/${randomUser._id}`,
  query: { userId: randomUser._id },
});

const render = () => renderWithProviders(<UserDetails />, { routerOptions: mockRouter });

describe('Pages/Users/[userId]', () => {
  beforeEach(() => {
    mockUseTeamsWithoutUser.mockReturnValue({
      data: TeamCheckedFactory.createMany(3),
    } as Partial<UseQueryResult>);
  });

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

import { waitFor } from '@testing-library/react';

import { ROUTES } from '@/constants/routes';
import useTeamsWithoutUser from '@/hooks/teams/useTeamsWithoutUser';
import useUserTeams from '@/hooks/teams/useUserTeams';
import useUser from '@/hooks/users/useUser';
import UserDetails from '@/pages/users/[userId]';
import { UseTeamsWithoutUserQueryReturnType } from '@/types/hooks/teams/useTeamsWithoutUserQueryReturnType';
import { UseUserTeamsQueryReturnType } from '@/types/hooks/teams/useUserTeamsQueryReturnType';
import { UseUserQueryReturnType } from '@/types/hooks/users/useUserQueryReturnType';
import { TeamCheckedFactory, TeamFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const randomUser = UserFactory.create();
const mockUseUser = useUser as jest.Mock<Partial<UseUserQueryReturnType>>;
jest.mock('@/hooks/users/useUser');

const mockUseUserTeams = useUserTeams as jest.Mock<Partial<UseUserTeamsQueryReturnType>>;
jest.mock('@/hooks/teams/useUserTeams');

const mockUseTeamsWithoutUser = useTeamsWithoutUser as jest.Mock<
  Partial<UseTeamsWithoutUserQueryReturnType>
>;
jest.mock('@/hooks/teams/useTeamsWithoutUser');

const { mockRouter } = libraryMocks.mockNextRouter({
  pathname: `/users/${randomUser._id}`,
  query: { userId: randomUser._id },
});

const render = () => renderWithProviders(<UserDetails />, { routerOptions: mockRouter });

describe('Pages/Users/[userId]', () => {
  beforeEach(() => {
    mockUseTeamsWithoutUser.mockReturnValue({
      fetchTeamsWithoutUser: {
        data: TeamCheckedFactory.createMany(3),
      },
    } as Partial<UseTeamsWithoutUserQueryReturnType>);
  });

  it('should render correctly', () => {
    // Arrange
    mockUseUser.mockReturnValue({
      fetchUser: {
        data: UserFactory.create(),
      },
    } as Partial<UseUserQueryReturnType>);

    mockUseUserTeams.mockReturnValue({
      fetchUserTeams: {
        data: TeamFactory.createMany(10),
      },
    } as Partial<UseUserTeamsQueryReturnType>);

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
      fetchUser: {
        isLoading: true,
      },
    } as Partial<UseUserQueryReturnType>);

    mockUseUserTeams.mockReturnValue({
      fetchUserTeams: {
        isLoading: true,
      },
    } as Partial<UseUserTeamsQueryReturnType>);

    // Act
    render();

    // Assert
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.Users);
    });
  });

  it.todo('should prefetch on getServerSide');
});

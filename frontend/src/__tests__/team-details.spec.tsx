import { waitFor } from '@testing-library/react';

import { ROUTES } from '@/constants/routes';
import useTeam from '@/hooks/teams/useTeam';
import useUsers from '@/hooks/users/useUsers';
import TeamDetails from '@/pages/teams/[teamId]';
import { UseTeamQueryReturnType } from '@/types/hooks/teams/useTeamQueryReturnType';
import { UseUsersQueryReturnType } from '@/types/hooks/users/useUsersQueryReturnType';
import { TeamFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const randomTeam = TeamFactory.create();
const mockUseTeam = useTeam as jest.Mock<Partial<UseTeamQueryReturnType>>;
jest.mock('@/hooks/teams/useTeam');

const mockUseUsers = useUsers as jest.Mock<Partial<UseUsersQueryReturnType>>;
jest.mock('@/hooks/users/useUsers');

const { mockRouter } = libraryMocks.mockNextRouter({
  pathname: `/teams/${randomTeam.id}`,
  query: { teamId: randomTeam.id },
});

const render = () => renderWithProviders(<TeamDetails />, { routerOptions: mockRouter });

describe('Pages/Teams/[teamId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseTeam.mockReturnValue({
      fetchTeam: {
        data: TeamFactory.create(),
      },
    } as Partial<UseTeamQueryReturnType>);

    mockUseUsers.mockReturnValue({
      fetchAllUsers: {
        data: UserFactory.createMany(10),
      },
    } as Partial<UseUsersQueryReturnType>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('teamHeader')).toBeInTheDocument();
    expect(getByTestId('teamMembersList')).toBeInTheDocument();
  });

  it('should redirect when no data is fetched', async () => {
    // Arrange
    mockUseTeam.mockReturnValue({
      fetchTeam: {
        isLoading: true,
      },
    } as Partial<UseTeamQueryReturnType>);

    mockUseUsers.mockReturnValue({
      fetchAllUsers: {
        isLoading: true,
      },
    } as Partial<UseUsersQueryReturnType>);

    // Act
    render();

    // Assert
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.Teams);
    });
  });

  it.todo('should prefetch on getServerSide');
});

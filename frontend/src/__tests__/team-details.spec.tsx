import { UseQueryResult } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';

import useTeam from '@/hooks/teams/useTeam';
import useUsers from '@/hooks/users/useUsers';
import TeamDetails from '@/pages/teams/[teamId]';
import { Team } from '@/types/team/team';
import { User } from '@/types/user/user';
import { TeamFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const randomTeam = TeamFactory.create();
const mockUseTeam = useTeam as jest.Mock<UseQueryResult<Team>>;
jest.mock('@/hooks/teams/useTeam');

const mockUseUsers = useUsers as jest.Mock<UseQueryResult<User[]>>;
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
      data: TeamFactory.create(),
    } as UseQueryResult<Team>);

    mockUseUsers.mockReturnValue({
      data: UserFactory.createMany(10),
    } as UseQueryResult<User[]>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('teamHeader')).toBeInTheDocument();
    expect(getByTestId('teamMembersList')).toBeInTheDocument();
  });

  it('should redirect when no data is fetched', async () => {
    // Arrange
    mockUseTeam.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<Team>);

    mockUseUsers.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<User[]>);

    // Act
    render();

    // Assert
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.Teams);
    });
  });

  it.todo('should prefetch on getServerSide');
});

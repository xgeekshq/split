import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import TeamDetails from '@/pages/teams/[teamId]';
import { libraryMocks } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';
import useTeam from '@/hooks/teams/useTeam';
import { UseQueryResult } from '@tanstack/react-query';
import { Team } from '@/types/team/team';
import useUsers from '@/hooks/users/useUsers';
import { User } from '@/types/user/user';
import { UserFactory } from '@/utils/factories/user';

const mockUseTeam = useTeam as jest.Mock<UseQueryResult<Team>>;
jest.mock('@/hooks/teams/useTeam');

const mockUseUsers = useUsers as jest.Mock<UseQueryResult<User[]>>;
jest.mock('@/hooks/users/useUsers');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams/[teamId]' });

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
});

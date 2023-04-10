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

const mockUseUser = useUser as jest.Mock<UseQueryResult<User>>;
jest.mock('@/hooks/users/useUser');

const mockUseUserTeams = useUserTeams as jest.Mock<UseQueryResult<Team[]>>;
jest.mock('@/hooks/teams/useUserTeams');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users/[userId]' });

const render = () => renderWithProviders(<UserDetails />, { routerOptions: mockRouter });

describe('Pages/Users/[userId]', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      data: UserFactory.create(),
    } as UseQueryResult<User>);

    mockUseUserTeams.mockReturnValue({
      data: TeamFactory.createMany(10),
    } as UseQueryResult<Team[]>);
  });

  it('should render correctly', () => {
    // Act
    const { getByTestId, getAllByTestId } = render();

    // Assert
    expect(getByTestId('userHeader')).toBeInTheDocument();
    expect(getByTestId('teamsList')).toBeInTheDocument();

    expect(getAllByTestId('teamItem')).toHaveLength(10);
  });
});

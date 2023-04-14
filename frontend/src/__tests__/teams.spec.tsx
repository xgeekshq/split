import { UseQueryResult } from '@tanstack/react-query';

import useTeams from '@/hooks/teams/useTeams';
import Teams from '@/pages/teams';
import { Team } from '@/types/team/team';
import { TeamFactory } from '@/utils/factories/team';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const mockUseTeams = useTeams as jest.Mock<UseQueryResult<Team[]>>;
jest.mock('@/hooks/teams/useTeams');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = () => renderWithProviders(<Teams />, { routerOptions: mockRouter });

describe('Pages/Teams', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseTeams.mockReturnValue({
      data: TeamFactory.createMany(3),
    } as UseQueryResult<Team[]>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('teamsList')).toBeInTheDocument();
  });

  it('should be loading', () => {
    // Arrange
    mockUseTeams.mockReturnValue({
      isLoading: true,
    } as UseQueryResult<Team[]>);

    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('loading')).toBeInTheDocument();
  });

  it.todo('should prefetch on getServerSide');
});

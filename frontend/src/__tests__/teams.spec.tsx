import useTeams from '@/hooks/teams/useTeams';
import Teams from '@/pages/teams';
import { UseTeamsQueryReturnType } from '@/types/hooks/teams/useTeamsQueryReturnType';
import { TeamFactory } from '@/utils/factories/team';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const mockUseTeams = useTeams as jest.Mock<Partial<UseTeamsQueryReturnType>>;
jest.mock('@/hooks/teams/useTeams');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = () => renderWithProviders(<Teams />, { routerOptions: mockRouter });

describe('Pages/Teams', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseTeams.mockReturnValue({
      fetchAllTeams: {
        data: TeamFactory.createMany(3),
      },
    } as Partial<UseTeamsQueryReturnType>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('teamsList')).toBeInTheDocument();
  });

  it('should be loading', () => {
    // Arrange
    mockUseTeams.mockReturnValue({
      fetchAllTeams: {
        isLoading: true,
      },
    } as Partial<UseTeamsQueryReturnType>);

    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('loading')).toBeInTheDocument();
  });

  it.todo('should prefetch on getServerSide');
});

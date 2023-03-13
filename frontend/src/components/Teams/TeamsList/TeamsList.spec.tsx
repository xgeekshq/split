import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import { fireEvent, waitFor } from '@testing-library/react';
import { ROUTES } from '@/utils/routes';
import TeamsList, { TeamsListProps } from '.';

const DEFAULT_PROPS = {
  teams: TeamFactory.createMany(3),
};

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: TeamsListProps = DEFAULT_PROPS) =>
  renderWithProviders(<TeamsList {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/TeamsList', () => {
  let testProps: TeamsListProps;
  beforeEach(() => {
    testProps = { ...DEFAULT_PROPS };
  });

  it('should render correctly', () => {
    // Arrange
    const teamItemProps = { ...testProps };

    // Act
    const { getAllByTestId } = render(teamItemProps);

    // Assert
    expect(getAllByTestId('teamItem')).toHaveLength(teamItemProps.teams.length);
  });

  it('should render empty state correctly', async () => {
    // Arrange
    const teamItemProps = { ...testProps, teams: [] };

    // Act
    const { getByTestId, getByText } = render(teamItemProps);
    fireEvent.click(getByText('Create your first team'));

    // Assert
    expect(getByTestId('emptyTeams')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.NewTeam,
        ROUTES.NewTeam,
        expect.anything(),
      );
    });
  });
});

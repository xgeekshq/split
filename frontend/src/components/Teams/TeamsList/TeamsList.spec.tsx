import { fireEvent, waitFor } from '@testing-library/react';

import TeamsList, { TeamsListProps } from '@/components/Teams/TeamsList/TeamList';
import { Team } from '@/types/team/team';
import { TeamFactory } from '@/utils/factories/team';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<TeamsListProps> = {}) =>
  renderWithProviders(<TeamsList teams={TeamFactory.createMany(3)} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Teams/TeamsList', () => {
  it('should render correctly', () => {
    // Arrange
    const teams = TeamFactory.createMany(3);

    // Act
    const { getAllByTestId } = render({ teams });

    // Assert
    expect(getAllByTestId('teamItem')).toHaveLength(teams.length);
  });

  it('should render empty state correctly', async () => {
    // Arrange
    const teams: Team[] = [];

    // Act
    const { getByTestId, getByText } = render({ teams });
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

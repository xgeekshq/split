import { fireEvent, waitFor } from '@testing-library/react';

import TeamBoards, {
  TeamBoardsProps,
} from '@/components/Teams/TeamsList/TeamItem/TeamBoards/TeamBoards';
import { TeamFactory } from '@/utils/factories/team';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: Partial<TeamBoardsProps> = {}) =>
  renderWithProviders(<TeamBoards havePermissions team={TeamFactory.create()} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Teams/TeamsList/TeamItem/TeamBoards', () => {
  it('should render No boards', () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 0 });

    // Act
    const { getByText } = render({ team, havePermissions: false });

    // Assert
    expect(getByText('No boards')).toBeInTheDocument();
  });

  it('should render Create first board', async () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 0 });

    // Act
    const { getByText } = render({ team });
    const link = getByText('Create first board');
    fireEvent.click(link);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.NewTeamBoard(team.id),
        ROUTES.NewTeamBoard(team.id),
        expect.anything(),
      );
    });

    // Assert
    expect(link).toBeInTheDocument();
  });

  it('should render N boards', async () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 3 });

    // Act
    const { getByText } = render({ team });
    const link = getByText('3 team boards');
    fireEvent.click(link);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.TeamBoards(team.id),
        ROUTES.TeamBoards(team.id),
        expect.anything(),
      );
    });

    // Assert
    expect(link).toBeInTheDocument();
  });
});

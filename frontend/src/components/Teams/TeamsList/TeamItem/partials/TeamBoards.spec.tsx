import { fireEvent, waitFor } from '@testing-library/react';
import { ROUTES } from '@/utils/routes';
import { TeamFactory } from '@/utils/factories/team';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import TeamBoards, { TeamBoardsProps } from './TeamBoards';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: TeamBoardsProps) =>
  renderWithProviders(<TeamBoards {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/TeamsList/TeamItem/TeamBoards', () => {
  it('should render No boards', () => {
    // Arrange
    const teamBoardsProps = {
      team: TeamFactory.create({ boardsCount: 0 }),
      havePermissions: false,
    };

    // Act
    const { getByText } = render(teamBoardsProps);

    // Assert
    expect(getByText('No boards')).toBeInTheDocument();
  });

  it('should render Create first board', async () => {
    // Arrange
    const teamBoardsProps = {
      team: TeamFactory.create({ boardsCount: 0 }),
      havePermissions: true,
    };

    // Act
    const { getByText } = render(teamBoardsProps);
    const link = getByText('Create first board');
    fireEvent.click(link);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.NewTeamBoard(teamBoardsProps.team.id),
        ROUTES.NewTeamBoard(teamBoardsProps.team.id),
        expect.anything(),
      );
    });

    // Assert
    expect(link).toBeInTheDocument();
  });

  it('should render N boards', async () => {
    // Arrange
    const teamBoardsProps = {
      team: TeamFactory.create({ boardsCount: 3 }),
      havePermissions: true,
    };

    // Act
    const { getByText } = render(teamBoardsProps);
    const link = getByText('3 team boards');
    fireEvent.click(link);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.TeamBoards(teamBoardsProps.team.id),
        ROUTES.TeamBoards(teamBoardsProps.team.id),
        expect.anything(),
      );
    });

    // Assert
    expect(link).toBeInTheDocument();
  });
});

import { RouterContext } from 'next/dist/shared/lib/router-context';
import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import { createMockRouter } from '@/utils/testing/mocks';
import { ROUTES } from '@/utils/routes';
import { TeamFactory } from '@/utils/factories/team';
import TeamBoards, { TeamBoardsProps } from './TeamBoards';

const router = createMockRouter({});
const render = (props: TeamBoardsProps) =>
  rtlRender(
    <RouterContext.Provider value={router}>
      <TeamBoards {...props} />
    </RouterContext.Provider>,
  );

describe('Components/Sidebar/Item', () => {
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
      expect(router.push).toHaveBeenCalledWith(
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
      expect(router.push).toHaveBeenCalledWith(
        ROUTES.TeamBoards(teamBoardsProps.team.id),
        ROUTES.TeamBoards(teamBoardsProps.team.id),
        expect.anything(),
      );
    });

    // Assert
    expect(link).toBeInTheDocument();
  });
});

// TODO: Test if Members & Team Admins <<Avatar Group>> is in the Document

import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import { TeamUserFactory } from '@/utils/factories/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import TeamItem, { TeamItemProps } from './index';

const DEFAULT_PROPS = {
  userId: '',
  team: TeamFactory.create(),
};

const router = createMockRouter({ pathname: '/teams' });

jest.mock('next/router', () => ({
  useRouter: () => router,
}));

const render = (props: TeamItemProps = DEFAULT_PROPS) =>
  renderWithProviders(<TeamItem {...props} />, { routerOptions: router });

describe('Components/TeamItem', () => {
  let testProps: TeamItemProps;
  beforeEach(() => {
    testProps = { ...DEFAULT_PROPS };
  });

  it('should render correctly', () => {
    // Arrange
    const teamItemProps = { ...testProps };

    // Act
    const { getByTestId, getByText } = render(teamItemProps);

    // Assert
    expect(getByTestId('teamitemTitle')).toBeInTheDocument();
    expect(getByText(teamItemProps.team.name)).toBeInTheDocument();
  });

  it('should render the amount of team boards', () => {
    // Arrange
    const teamItemProps = {
      ...testProps,
      team: {
        ...testProps.team,
        boardsCount: 3,
      },
    };

    // Act
    const { getByTestId } = render(teamItemProps);

    // Assert
    expect(getByTestId('teamitemBoards')).toBeInTheDocument();
    expect(getByTestId('teamitemBoards')).toHaveTextContent('3 team boards');
  });

  it('should render no team boards', () => {
    // Arrange
    const teamItemProps = {
      ...testProps,
      team: {
        ...testProps.team,
        boardsCount: 0,
      },
    };

    // Act
    const { getByTestId } = render(teamItemProps);

    // Assert
    expect(getByTestId('teamitemBoards')).toBeInTheDocument();
    expect(getByTestId('teamitemBoards')).toHaveTextContent('No boards');
  });

  it('should render create first board', () => {
    // Arrange
    const teamAdmin = TeamUserFactory.create({ role: TeamUserRoles.ADMIN });
    const teamItemProps = {
      userId: teamAdmin.user._id,
      team: {
        ...testProps.team,
        boardsCount: 0,
        users: [...testProps.team.users, teamAdmin],
      },
    };

    // Act
    const { getByTestId } = render(teamItemProps);

    // Assert
    expect(getByTestId('teamitemBoards')).toBeInTheDocument();
    expect(getByTestId('teamitemBoards')).toHaveTextContent('Create first board');
  });
});

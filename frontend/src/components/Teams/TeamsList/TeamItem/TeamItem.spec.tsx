// TODO: Test if Members & Team Admins <<Avatar Group>> is in the Document

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import { TeamUserFactory } from '@/utils/factories/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { libraryMocks } from '@/utils/testing/mocks';
import TeamItem, { TeamItemProps } from './index';

const DEFAULT_PROPS = {
  team: TeamFactory.create(),
};

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: TeamItemProps = DEFAULT_PROPS, options?: any) =>
  renderWithProviders(<TeamItem {...props} />, {
    routerOptions: mockRouter,
    sessionOptions: {
      user: options?.user,
    },
  });

describe('Components/Teams/TeamsList/TeamItem', () => {
  let testProps: TeamItemProps;
  beforeEach(() => {
    testProps = { ...DEFAULT_PROPS };
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    // Arrange
    const teamItemProps = { ...testProps };

    // Act
    const { getByText } = render(teamItemProps);

    // Assert
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
    const { getByText } = render(teamItemProps);

    // Assert
    expect(getByText('3 team boards')).toBeInTheDocument();
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
    const { getByText } = render(teamItemProps);

    // Assert
    expect(getByText('No boards')).toBeInTheDocument();
  });

  it('should render create first board', () => {
    // Arrange
    const teamAdmin = TeamUserFactory.create({ role: TeamUserRoles.ADMIN });
    const teamItemProps = {
      team: {
        ...testProps.team,
        boardsCount: 0,
        users: [...testProps.team.users, teamAdmin],
      },
    };

    // Act
    const { getByText } = render(teamItemProps, { user: teamAdmin.user });

    // Assert
    expect(getByText('Create first board')).toBeInTheDocument();
  });
});

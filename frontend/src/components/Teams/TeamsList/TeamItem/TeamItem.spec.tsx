// TODO: Test if Members & Team Admins <<Avatar Group>> is in the Document

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import { TeamUserFactory } from '@/utils/factories/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { libraryMocks } from '@/utils/testing/mocks';
import TeamItem, { TeamItemProps } from '@/components/Teams/TeamsList/TeamItem/TeamItem';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<TeamItemProps> = {}, options?: any) =>
  renderWithProviders(
    <TeamItem
      team={TeamFactory.create()}
      isSAdmin={options?.user.isSAdmin ?? false}
      userId={options?.user._id}
      {...props}
    />,
    {
      routerOptions: mockRouter,
    },
  );

describe('Components/Teams/TeamsList/TeamItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByText } = render({ team });

    // Assert
    expect(getByText(team.name)).toBeInTheDocument();
  });

  it('should render the amount of team boards', () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 3 });

    // Act
    const { getByText } = render({ team });

    // Assert
    expect(getByText('3 team boards')).toBeInTheDocument();
  });

  it('should render no team boards', () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 0 });

    // Act
    const { getByText } = render({ team });

    // Assert
    expect(getByText('No boards')).toBeInTheDocument();
  });

  it('should render create first board', () => {
    // Arrange
    const teamAdmin = TeamUserFactory.create({ role: TeamUserRoles.ADMIN });
    const team = TeamFactory.create({
      users: [teamAdmin],
      boardsCount: 0,
    });

    // Act
    const { getByText } = render({ team }, { user: teamAdmin.user });

    // Assert
    expect(getByText('Create first board')).toBeInTheDocument();
  });
});

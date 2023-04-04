import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { AvatarGroupUsersFactory } from '@/utils/factories/user';
import { getInitials } from '@/utils/getInitials';
import { User } from '@/types/user/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import AvatarGroup, { AvatarGroupProps } from './AvatarGroup';

const router = createMockRouter({});

const render = (props: Partial<AvatarGroupProps> = {}) =>
  renderWithProviders(
    <AvatarGroup listUsers={AvatarGroupUsersFactory.createMany(3)} userId="123" {...props} />,
    { routerOptions: router },
  );

describe('Components/Primitives/Avatars/AvatarGroup', () => {
  it('should render correctly', () => {
    // Arrange
    const listUsers = AvatarGroupUsersFactory.createMany(5);

    // Act
    const { getByText, getAllByText } = render({ listUsers });

    // Assert
    for (let i = 0; i < 2; i++) {
      expect(
        getAllByText(
          getInitials((listUsers[i].user as User).firstName, (listUsers[i].user as User).lastName),
        )[0],
      ).toBeInTheDocument();
    }

    expect(getByText(`+${listUsers.length - 2}`));
  });

  it('should render stakeholders', () => {
    // Arrange
    const listUsers = AvatarGroupUsersFactory.createMany(5, [
      { role: TeamUserRoles.STAKEHOLDER },
      { role: TeamUserRoles.STAKEHOLDER },
      { role: TeamUserRoles.STAKEHOLDER },
      { role: TeamUserRoles.MEMBER },
      { role: TeamUserRoles.MEMBER },
    ]);

    // Act
    const { getAllByText } = render({ listUsers, stakeholders: true });

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(
        getAllByText(
          getInitials((listUsers[i].user as User).firstName, (listUsers[i].user as User).lastName),
        )[0],
      ).toBeInTheDocument();
    }
  });

  it('should render admins', () => {
    // Arrange
    const listUsers = AvatarGroupUsersFactory.createMany(5, [
      { role: TeamUserRoles.ADMIN },
      { role: TeamUserRoles.ADMIN },
      { role: TeamUserRoles.ADMIN },
      { role: TeamUserRoles.MEMBER },
      { role: TeamUserRoles.MEMBER },
    ]);

    // Act
    const { getAllByText } = render({ listUsers, teamAdmins: true });

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(
        getAllByText(
          getInitials((listUsers[i].user as User).firstName, (listUsers[i].user as User).lastName),
        )[0],
      ).toBeInTheDocument();
    }
  });

  it('should render responsibles', () => {
    // Arrange
    const listUsers = AvatarGroupUsersFactory.createMany(5, [
      { role: BoardUserRoles.RESPONSIBLE },
      { role: BoardUserRoles.RESPONSIBLE },
      { role: BoardUserRoles.RESPONSIBLE },
      { role: TeamUserRoles.MEMBER },
      { role: TeamUserRoles.MEMBER },
    ]);

    // Act
    const { getAllByText } = render({ listUsers, responsible: true });

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(
        getAllByText(
          getInitials((listUsers[i].user as User).firstName, (listUsers[i].user as User).lastName),
        )[0],
      ).toBeInTheDocument();
    }
  });

  it('should render error state', () => {
    // Arrange
    const listUsers = AvatarGroupUsersFactory.createMany(3);

    // Act
    const { getAllByText } = render({ listUsers, haveError: true });

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(getAllByText('-')).toHaveLength(3);
    }
  });
});

import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { AvatarGroupUsersFactory } from '@/utils/factories/user';
import { getInitials } from '@/utils/getInitials';
import { User } from '@/types/user/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import AvatarGroup, { AvatarGroupProps } from './AvatarGroup';

const router = createMockRouter({});

const render = (props: AvatarGroupProps) =>
  renderWithProviders(<AvatarGroup {...props} />, { routerOptions: router });

describe('Components/Primitives/Avatars/AvatarGroup', () => {
  it('should render correctly', () => {
    // Arrange
    const testProps = {
      listUsers: AvatarGroupUsersFactory.createMany(5),
      userId: undefined,
    };

    // Act
    const { getByText } = render(testProps);

    // Assert
    for (let i = 0; i < 2; i++) {
      expect(
        getByText(
          getInitials(
            (testProps.listUsers[i].user as User).firstName,
            (testProps.listUsers[i].user as User).lastName,
          ),
        ),
      );
    }

    expect(getByText(`+${testProps.listUsers.length - 2}`));
  });

  it('should render stakeholders', () => {
    // Arrange
    const testProps = {
      listUsers: AvatarGroupUsersFactory.createMany(5, [
        { role: TeamUserRoles.STAKEHOLDER },
        { role: TeamUserRoles.STAKEHOLDER },
        { role: TeamUserRoles.STAKEHOLDER },
        { role: TeamUserRoles.MEMBER },
        { role: TeamUserRoles.MEMBER },
      ]),
      userId: undefined,
      stakeholders: true,
    };

    // Act
    const { getByText } = render(testProps);

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(
        getByText(
          getInitials(
            (testProps.listUsers[i].user as User).firstName,
            (testProps.listUsers[i].user as User).lastName,
          ),
        ),
      );
    }
  });

  it('should render admins', () => {
    // Arrange
    const testProps = {
      listUsers: AvatarGroupUsersFactory.createMany(5, [
        { role: TeamUserRoles.ADMIN },
        { role: TeamUserRoles.ADMIN },
        { role: TeamUserRoles.ADMIN },
        { role: TeamUserRoles.MEMBER },
        { role: TeamUserRoles.MEMBER },
      ]),
      userId: undefined,
      teamAdmins: true,
    };

    // Act
    const { getByText } = render(testProps);

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(
        getByText(
          getInitials(
            (testProps.listUsers[i].user as User).firstName,
            (testProps.listUsers[i].user as User).lastName,
          ),
        ),
      );
    }
  });

  it('should render responsibles', () => {
    // Arrange
    const testProps = {
      listUsers: AvatarGroupUsersFactory.createMany(5, [
        { role: BoardUserRoles.RESPONSIBLE },
        { role: BoardUserRoles.RESPONSIBLE },
        { role: BoardUserRoles.RESPONSIBLE },
        { role: TeamUserRoles.MEMBER },
        { role: TeamUserRoles.MEMBER },
      ]),
      userId: undefined,
      responsible: true,
    };

    // Act
    const { getByText } = render(testProps);

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(
        getByText(
          getInitials(
            (testProps.listUsers[i].user as User).firstName,
            (testProps.listUsers[i].user as User).lastName,
          ),
        ),
      );
    }
  });

  it('should render error state', () => {
    // Arrange
    const testProps = {
      listUsers: AvatarGroupUsersFactory.createMany(3),
      userId: undefined,
      haveError: true,
    };

    // Act
    const { getAllByText } = render(testProps);

    // Assert
    for (let i = 0; i < 3; i++) {
      expect(getAllByText('-')).toHaveLength(3);
    }
  });
});

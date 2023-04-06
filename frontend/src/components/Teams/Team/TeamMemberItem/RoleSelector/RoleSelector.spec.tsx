import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { getFormattedTeamUserRole } from '@/utils/getFormattedTeamUserRole';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import RoleSelector, {
  RoleSelectorProps,
} from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<RoleSelectorProps> = {}) =>
  renderWithProviders(
    <RoleSelector
      role={TeamUserRoles.MEMBER}
      handleRoleChange={jest.fn()}
      canChangeRole={false}
      {...props}
    />,
    { routerOptions: mockRouter },
  );

describe('Components/Teams/Team/TeamMemberItem/RoleSelector', () => {
  it('should render correctly', () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByText } = render({ role: team.users[0].role });

    // Assert
    expect(getByText(getFormattedTeamUserRole(team.users[0].role))).toBeInTheDocument();
  });

  it('should allow to change role', () => {
    // Act
    const { getByRole } = render({ canChangeRole: true });

    // Assert
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should not allow to change role', () => {
    // Act
    const { queryByRole } = render({ canChangeRole: false });

    // Assert
    expect(queryByRole('button')).not.toBeInTheDocument();
  });
});

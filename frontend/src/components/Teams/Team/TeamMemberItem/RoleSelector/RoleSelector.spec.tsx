import React from 'react';

import RoleSelector, {
  RoleSelectorProps,
} from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { TeamFactory } from '@/utils/factories/team';
import { getFormattedTeamUserRole } from '@/utils/getFormattedTeamUserRole';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<RoleSelectorProps> = {}) =>
  renderWithProviders(
    <RoleSelector
      canChangeRole={false}
      handleRoleChange={jest.fn()}
      role={TeamUserRoles.MEMBER}
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

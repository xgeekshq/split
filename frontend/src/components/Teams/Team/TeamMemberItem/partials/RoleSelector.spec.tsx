import React from 'react';
import { createMockRouter } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { getFormattedTeamUserRole } from '@/utils/getFormattedTeamUserRole';
import RoleSelector, { RoleSelectorProps } from './RoleSelector';

const router = createMockRouter({ pathname: '/teams' });

jest.mock('next/router', () => ({
  useRouter: () => router,
}));

const render = (props: RoleSelectorProps) =>
  renderWithProviders(<RoleSelector {...props} />, { routerOptions: router });

describe('Components/Teams/Team/TeamMemberItem/RoleSelector', () => {
  let defaultProps: RoleSelectorProps;
  beforeEach(() => {
    const team = TeamFactory.create();
    defaultProps = {
      role: team.users[0].role,
      userId: team.users[0].user._id,
      isTeamPage: true,
      canChangeRole: true,
    };
  });

  it('should render correctly', () => {
    // Arrange
    const roleSelectorProps = { ...defaultProps };
    // Act
    const { getByText } = render(roleSelectorProps);

    // Assert
    expect(getByText(getFormattedTeamUserRole(roleSelectorProps.role))).toBeInTheDocument();
  });

  it('should allow to change role', () => {
    // Arrange
    const roleSelectorProps = { ...defaultProps };
    // Act
    const { getByRole } = render(roleSelectorProps);

    // Assert
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should not allow to change role', () => {
    // Arrange
    const roleSelectorProps = { ...defaultProps, canChangeRole: false };
    // Act
    const { queryByRole } = render(roleSelectorProps);

    // Assert
    expect(queryByRole('button')).not.toBeInTheDocument();
  });
});

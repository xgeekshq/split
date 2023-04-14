import React from 'react';

import TeamMemberItem, {
  TeamMemberItemProps,
} from '@/components/Teams/Team/TeamMemberItem/TeamMemberItem';
import { TeamUserFactory } from '@/utils/factories/user';
import { getFormattedUsername } from '@/utils/getFormattedUsername';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<TeamMemberItemProps> = {}) =>
  renderWithProviders(<TeamMemberItem isTeamPage member={TeamUserFactory.create()} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Teams/Team/TeamMemberItem', () => {
  it('should render correctly', () => {
    // Arrange
    const member = TeamUserFactory.create();

    // Act
    const { getByText, getByTestId } = render({ member });

    // Assert
    expect(
      getByText(getFormattedUsername(member.user.firstName, member.user.lastName)),
    ).toBeInTheDocument();
    expect(getByTestId('roleSelector')).toBeInTheDocument();
  });

  it('should allow to change new joiner status', () => {
    // Act
    const { getByTestId } = render({ hasPermissions: true });

    // Assert
    expect(getByTestId('boardRolePopover')).toBeInTheDocument();
  });

  it('should not allow to change new joiner status', () => {
    // Act
    const { getByTestId } = render({
      member: TeamUserFactory.create({ isNewJoiner: true }),
      hasPermissions: false,
    });

    // Assert
    expect(getByTestId('newJoinerTooltip')).toBeInTheDocument();
  });
});

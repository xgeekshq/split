import React from 'react';
import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamUserFactory } from '@/utils/factories/user';
import { getFormattedUsername } from '@/utils/getFormattedUsername';
import TeamMemberItem, { TeamMemberItemProps } from '.';

const router = createMockRouter({});

const DEFAULT_PROPS = {
  member: TeamUserFactory.create(),
  isTeamPage: true,
};

const render = (props: TeamMemberItemProps) =>
  renderWithProviders(<TeamMemberItem {...props} />, { routerOptions: router });

describe('Components/Teams/Team/TeamMemberItem', () => {
  it('should render correctly', () => {
    // Arrange
    const teamMemberItemProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getByTestId } = render(teamMemberItemProps);

    // Assert
    expect(
      getByText(
        getFormattedUsername(
          teamMemberItemProps.member.user.firstName,
          teamMemberItemProps.member.user.lastName,
        ),
      ),
    ).toBeInTheDocument();
    expect(getByTestId('roleSelector')).toBeInTheDocument();
  });

  it('should allow to change new joiner status', () => {
    // Arrange
    const teamMemberItemProps = { ...DEFAULT_PROPS, hasPermissions: true };

    // Act
    const { getByTestId } = render(teamMemberItemProps);

    // Assert
    expect(getByTestId('configurationSwitch')).toBeInTheDocument();
  });

  it('should not allow to change new joiner status', () => {
    // Arrange
    const teamMemberItemProps = {
      ...DEFAULT_PROPS,
      member: TeamUserFactory.create({ isNewJoiner: true }),
      hasPermissions: false,
    };

    // Act
    const { getByTestId } = render(teamMemberItemProps);

    // Assert
    expect(getByTestId('newJoinerTooltip')).toBeInTheDocument();
  });
});

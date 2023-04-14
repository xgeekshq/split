import React from 'react';

import TeamMembersList, { TeamMembersListProps } from '@/components/Teams/Team/TeamMembersList';
import { TeamUserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<TeamMembersListProps> = {}) =>
  renderWithProviders(
    <TeamMembersList
      hasPermissions
      isTeamPage
      teamUsers={TeamUserFactory.createMany(3)}
      {...props}
    />,
    { routerOptions: mockRouter },
  );

describe('Components/Teams/Team/TeamMembersList', () => {
  it('should render correctly', () => {
    // Arrange
    const teamUsers = TeamUserFactory.createMany(3);

    // Act
    const { getAllByTestId } = render({ teamUsers });

    // Assert
    expect(getAllByTestId('teamMemberItem')).toHaveLength(teamUsers.length);
  });
});

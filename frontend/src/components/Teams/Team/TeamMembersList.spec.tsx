import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamUserFactory } from '@/utils/factories/user';
import TeamMembersList, { TeamMembersListProps } from '@/components/Teams/Team/TeamMembersList';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<TeamMembersListProps> = {}) =>
  renderWithProviders(
    <TeamMembersList
      teamUsers={TeamUserFactory.createMany(3)}
      hasPermissions
      isTeamPage
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

import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import TeamMembersList, { TeamMembersListProps } from '.';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: TeamMembersListProps) =>
  renderWithProviders(<TeamMembersList {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/Team/TeamMembersList', () => {
  it('should render correctly', () => {
    // Arrange
    const team = TeamFactory.create();
    const teamMembersListProps: TeamMembersListProps = {
      teamUsers: team.users,
      isTeamPage: true,
      hasPermissions: true,
    };

    // Act
    const { getAllByTestId } = render(teamMembersListProps);

    // Assert
    expect(getAllByTestId('teamMemberItem')).toHaveLength(team.users.length);
  });
});

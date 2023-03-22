import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import UserTeamsList, { UserTeamsListProps } from './UserTeamsList';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const render = (props: Partial<UserTeamsListProps> = {}) =>
  renderWithProviders(<UserTeamsList userTeams={TeamFactory.createMany()} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Users/User/UserTeamsList', () => {
  it('should render correctly', () => {
    // Arrange
    const teams = TeamFactory.createMany();

    // Act
    const { getAllByTestId } = render({ userTeams: teams });

    // Assert
    expect(getAllByTestId('teamItem')).toHaveLength(teams.length);
  });
});

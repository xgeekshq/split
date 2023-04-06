import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TEAMS_ROUTE } from '@/utils/routes';
import { TeamFactory } from '@/utils/factories/team';
import TeamHeader, { TeamHeaderProps } from '@/components/Teams/Team/Header/Header';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
libraryMocks.mockReactQuery();
const render = (props: Partial<TeamHeaderProps> = {}) =>
  renderWithProviders(<TeamHeader title="MyTeam" hasPermissions {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Teams/Team/Header', () => {
  it('should render correctly', () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByTestId } = render({ title: team.name });
    const title = getByTestId('teamHeader').querySelector('span');

    // Assert
    expect(title).toHaveTextContent(team.name);
  });

  it('should render breadcrumbs correctly', async () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByTestId } = render({ title: team.name });
    const breadcrumbs = getByTestId('teamHeader').querySelectorAll('li');
    const [teamBreadcrumb, currentTeamBreadcrumb] = breadcrumbs;

    fireEvent.click(teamBreadcrumb.querySelector('a')!);

    // Assert
    expect(breadcrumbs).toHaveLength(2);
    expect(currentTeamBreadcrumb).toHaveTextContent(team.name);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(TEAMS_ROUTE, TEAMS_ROUTE, expect.anything());
    });
  });

  it('should be able to open the team members dialog', async () => {
    // Arrange
    const setState = jest.fn();
    const useStateMock: any = (initState: boolean) => [initState, setState];
    jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);

    // Act
    const { getByTestId } = render();
    const button = getByTestId('teamHeader').querySelector('button');
    if (button) fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});

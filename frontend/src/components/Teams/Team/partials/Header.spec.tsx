import React from 'react';
import { createMockRouter } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TEAMS_ROUTE } from '@/utils/routes';
import { Team } from '@/types/team/team';
import TeamHeader, { TeamHeaderProps } from './Header';

const DEFAULT_PROPS = {
  hasPermissions: true,
};

const router = createMockRouter({});

const render = (props: TeamHeaderProps) =>
  renderWithProviders(<TeamHeader {...props} />, { routerOptions: router });

describe('Components/TeamsHeader', () => {
  let team: Team;
  beforeEach(() => {
    team = TeamFactory.create();
  });

  it('should render correctly', () => {
    // Arrange
    const teamHeaderProps = { ...DEFAULT_PROPS, title: team.name };

    // Act
    const { getByTestId } = render(teamHeaderProps);
    const title = getByTestId('teamHeader').querySelector('span');

    // Assert
    expect(title).toHaveTextContent(teamHeaderProps.title);
  });

  it('should render breadcrumbs correctly', async () => {
    // Arrange
    const teamHeaderProps = { ...DEFAULT_PROPS, title: team.name };

    // Act
    const { getByTestId } = render(teamHeaderProps);
    const breadcrumbs = getByTestId('teamHeader').querySelectorAll('li');
    const [teamBreadcrumb, currentTeamBreadcrumb] = breadcrumbs;

    fireEvent.click(teamBreadcrumb.querySelector('a')!);

    // Assert
    expect(breadcrumbs).toHaveLength(2);
    expect(currentTeamBreadcrumb).toHaveTextContent(teamHeaderProps.title);
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(TEAMS_ROUTE, TEAMS_ROUTE, expect.anything());
    });
  });

  it('should be able to open the team members dialog', async () => {
    // Arrange
    const teamHeaderProps = { title: team.name, hasPermissions: true };
    const setState = jest.fn();
    const useStateMock: any = (initState: boolean) => [initState, setState];
    jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);

    // Act
    const { getByTestId } = render(teamHeaderProps);
    const button = getByTestId('teamHeader').querySelector('button')!;
    fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});

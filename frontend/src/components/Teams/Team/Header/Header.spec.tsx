import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TEAMS_ROUTE } from '@/utils/routes';
import TeamHeader, { TeamHeaderProps } from './Header';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: TeamHeaderProps) =>
  renderWithProviders(<TeamHeader {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/Team/TeamHeader', () => {
  let defaultProps: TeamHeaderProps;
  beforeEach(() => {
    const team = TeamFactory.create();
    defaultProps = {
      title: team.name,
      hasPermissions: true,
    };
  });

  it('should render correctly', () => {
    // Arrange
    const teamHeaderProps = { ...defaultProps };

    // Act
    const { getByTestId } = render(teamHeaderProps);
    const title = getByTestId('teamHeader').querySelector('span');

    // Assert
    expect(title).toHaveTextContent(teamHeaderProps.title);
  });

  it('should render breadcrumbs correctly', async () => {
    // Arrange
    const teamHeaderProps = { ...defaultProps };

    // Act
    const { getByTestId } = render(teamHeaderProps);
    const breadcrumbs = getByTestId('teamHeader').querySelectorAll('li');
    const [teamBreadcrumb, currentTeamBreadcrumb] = breadcrumbs;

    fireEvent.click(teamBreadcrumb.querySelector('a')!);

    // Assert
    expect(breadcrumbs).toHaveLength(2);
    expect(currentTeamBreadcrumb).toHaveTextContent(teamHeaderProps.title);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(TEAMS_ROUTE, TEAMS_ROUTE, expect.anything());
    });
  });

  it('should be able to open the team members dialog', async () => {
    // Arrange
    const teamHeaderProps = { ...defaultProps };
    const setState = jest.fn();
    const useStateMock: any = (initState: boolean) => [initState, setState];
    jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);

    // Act
    const { getByTestId } = render(teamHeaderProps);
    const button = getByTestId('teamHeader').querySelector('button');
    if (button) fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});

import { fireEvent, waitFor } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import TeamTitle, { TeamTitleProps } from './TeamTitle';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: TeamTitleProps) =>
  renderWithProviders(<TeamTitle {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/TeamsList/TeamItem/TeamTitle', () => {
  let defaultProps: TeamTitleProps;
  beforeEach(() => {
    const team = TeamFactory.create();
    defaultProps = { title: team.name, teamId: team.id, isTeamPage: false };
  });

  it('should render correctly', () => {
    // Arrange
    const teamTitleProps = { ...defaultProps };

    // Act
    const { getByText } = render(teamTitleProps);

    // Assert
    expect(getByText(teamTitleProps.title)).toBeInTheDocument();
  });

  it('should redirect to team page', async () => {
    // Arrange
    const teamTitleProps = { ...defaultProps, isTeamPage: true };

    // Act
    const { getByText } = render(teamTitleProps);
    fireEvent.click(getByText(teamTitleProps.title));

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.TeamPage(teamTitleProps.teamId),
        ROUTES.TeamPage(teamTitleProps.teamId),
        expect.anything(),
      );
    });
  });
});

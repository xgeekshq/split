import { fireEvent, waitFor } from '@testing-library/react';

import TeamTitle, {
  TeamTitleProps,
} from '@/components/Teams/TeamsList/TeamItem/TeamTitle/TeamTitle';
import { ROUTES } from '@/constants/routes';
import { TeamFactory } from '@/utils/factories/team';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: Partial<TeamTitleProps>) =>
  renderWithProviders(<TeamTitle teamId="123" title="MyTeam" {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Teams/TeamsList/TeamItem/TeamTitle', () => {
  it('should render correctly', () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByText } = render({ title: team.name });

    // Assert
    expect(getByText(team.name)).toBeInTheDocument();
  });

  it('should redirect to team page', async () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByText } = render({ title: team.name, teamId: team.id });
    fireEvent.click(getByText(team.name));

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.TeamPage(team.id),
        ROUTES.TeamPage(team.id),
        expect.anything(),
      );
    });
  });
});

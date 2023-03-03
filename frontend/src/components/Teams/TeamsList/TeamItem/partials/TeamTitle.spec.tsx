import { createMockRouter } from '@/utils/testing/mocks';
import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { ROUTES } from '@/utils/routes';
import TeamTitle, { TeamTitleProps } from './TeamTitle';

const router = createMockRouter({});

const render = (props: TeamTitleProps) =>
  rtlRender(
    <RouterContext.Provider value={router}>
      <TeamTitle {...props} />
    </RouterContext.Provider>,
  );

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
      expect(router.push).toHaveBeenCalledWith(
        ROUTES.TeamPage(teamTitleProps.teamId),
        ROUTES.TeamPage(teamTitleProps.teamId),
        expect.anything(),
      );
    });
  });
});

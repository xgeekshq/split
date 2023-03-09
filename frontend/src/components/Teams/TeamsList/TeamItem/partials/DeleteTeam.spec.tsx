import { fireEvent } from '@testing-library/react';
import { libraryMocks } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import DeleteTeam, { DeleteTeamProps } from './DeleteTeam';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: DeleteTeamProps) =>
  renderWithProviders(<DeleteTeam {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/TeamsList/TeamItem/DeleteTeam', () => {
  it('should handle onClick events', () => {
    // Arrange
    const team = TeamFactory.create();
    const deleteTeamProps = {
      teamName: team.name,
      teamId: team.id,
      teamUserId: team.users[0]._id,
      isTeamPage: true,
    };

    // Act
    const { getByTestId, getByText } = render(deleteTeamProps);
    fireEvent.click(getByTestId('deleteTeamTrigger'));

    // Assert
    expect(getByText('Delete')).toBeInTheDocument();
  });
});

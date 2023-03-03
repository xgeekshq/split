import { fireEvent } from '@testing-library/react';
import { createMockRouter } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import DeleteTeam, { DeleteTeamProps } from './DeleteTeam';

const router = createMockRouter({});

const render = (props: DeleteTeamProps) =>
  renderWithProviders(<DeleteTeam {...props} />, { routerOptions: router });

describe('Components/DeleteTeam', () => {
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

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react';
import CreateTeam from './CreateTeam';

const render = () => renderWithProviders(<CreateTeam />);

describe('Teams/CreateTeam', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId, queryByLabelText } = render();

    // Assert
    expect(getByTestId('createHeader')).toBeInTheDocument();
    expect(getByTestId('createFooter')).toBeInTheDocument();
    expect(getByTestId('tipbar')).toBeInTheDocument();
    expect(queryByLabelText('Team name')).toBeInTheDocument();
    expect(getByTestId('addRemoveMembersTrigger')).toBeInTheDocument();
    expect(getByTestId('teamMembersList')).toBeInTheDocument();
  });

  it('should open a UserListDialog', async () => {
    // Act
    const { getByTestId } = render();

    // Assert
    fireEvent.click(getByTestId('addRemoveMembersTrigger'));

    await waitFor(() => {
      expect(getByTestId('userListDialog')).toBeInTheDocument();
    });
  });
});

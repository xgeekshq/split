import { UseMutationResult } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateTeam from '@/components/Teams/CreateTeam/CreateTeam';
import { ROUTES } from '@/constants/routes';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import useCreateTeam from '@hooks/teams/useCreateTeam';
import { libraryMocks } from '@utils/testing/mocks';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: ROUTES.NewTeam });

const render = () => renderWithProviders(<CreateTeam />, { routerOptions: mockRouter });

const mockUseCreateTeam = useCreateTeam as jest.Mock<Partial<UseMutationResult>>;
jest.mock('@/hooks/teams/useCreateTeam');

describe('Teams/CreateTeam', () => {
  beforeEach(() => {
    mockUseCreateTeam.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    fireEvent.click(getByTestId('addRemoveMembersTrigger'));

    // Assert

    await waitFor(() => {
      expect(getByTestId('userListDialog')).toBeInTheDocument();
    });
  });

  it('should handle create team', async () => {
    // Arrange
    const createTeamMutation = jest.fn();

    mockUseCreateTeam.mockReturnValue({
      mutate: createTeamMutation,
      status: 'success',
    } as Partial<UseMutationResult>);

    // Act
    const { getByText, getByLabelText } = render();

    await userEvent.type(getByLabelText('Team name'), 'MyTeam');

    fireEvent.click(getByText('Create team'));

    // Assert

    await waitFor(() => {
      expect(createTeamMutation).toBeCalledWith({ name: 'MyTeam', users: [] });
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.Teams);
    });
  });

  it('should redirect back', async () => {
    // Act
    const { getByTestId } = render();
    fireEvent.click(getByTestId('backButton'));

    // Assert

    await waitFor(() => {
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });
});

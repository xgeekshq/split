import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/react';

import UserItemActions, {
  UserItemActionsProps,
} from '@/components/Users/UsersList/UserItem/UserItemActions/UserItemActions';
import useDeleteUser from '@/hooks/users/useDeleteUser';
import useUpdateUser from '@/hooks/users/useUpdateUser';
import { UserFactory } from '@/utils/factories/user';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const render = (props: Partial<UserItemActionsProps> = {}) =>
  renderWithProviders(<UserItemActions user={UserFactory.create()} {...props} />, {
    routerOptions: mockRouter,
  });

const mockUseUpdateUser = useUpdateUser as jest.Mock<Partial<UseMutationResult>>;
const mockUseDeleteUser = useDeleteUser as jest.Mock<Partial<UseMutationResult>>;

jest.mock('@/hooks/users/useUpdateUser');
jest.mock('@/hooks/users/useDeleteUser');

describe('Components/Users/User/UsersList/UserItem/UserItemActions', () => {
  beforeEach(() => {
    mockUseUpdateUser.mockReturnValue({
      mutateAsync: jest.fn(),
    } as Partial<UseMutationResult>);

    mockUseDeleteUser.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);
  });

  it('should render correctly', () => {
    // Act
    const { getByTestId, getAllByRole } = render();

    // Assert
    expect(getByTestId('configurationSwitch')).toBeInTheDocument();
    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('should redirect to user page', async () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getAllByRole } = render({ user });

    const userDetailsBtn = getAllByRole('button')[0];

    expect(userDetailsBtn.querySelector('svg > use')).toHaveAttribute('href', '#edit');

    fireEvent.click(userDetailsBtn);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.UserPage(user._id),
        ROUTES.UserPage(user._id),
        expect.anything(),
      );
    });
  });

  it('should handle super admin status change', async () => {
    // Arrange
    const user = UserFactory.create();

    const updateUserMutation = jest.fn();

    mockUseUpdateUser.mockReturnValueOnce({
      mutate: updateUserMutation,
    } as Partial<UseMutationResult>);

    // Act
    const { getByRole } = render({ user });

    // Assert
    fireEvent.click(getByRole('switch'));

    await waitFor(() => {
      expect(updateUserMutation).toBeCalledWith({ _id: user._id, isSAdmin: !user.isSAdmin });
    });
  });

  it('should handle delete user action', async () => {
    // Arrange
    const user = UserFactory.create();

    const deleteUserMutation = jest.fn();

    mockUseDeleteUser.mockReturnValueOnce({
      mutate: deleteUserMutation,
    } as Partial<UseMutationResult>);

    // Act
    const { getAllByRole, getByRole, getByText } = render({ user });

    const deleteUserBtn = getAllByRole('button')[1];

    // Assert
    expect(deleteUserBtn.querySelector('svg > use')).toHaveAttribute('href', '#trash-alt');

    fireEvent.click(deleteUserBtn);

    await waitFor(() => {
      expect(getByRole('alertdialog')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Delete'));

    await waitFor(() => {
      expect(deleteUserMutation).toBeCalledWith({ id: user._id });
    });
  });
});

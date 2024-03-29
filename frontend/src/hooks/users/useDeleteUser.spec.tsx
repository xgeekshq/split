import { renderHook, waitFor } from '@testing-library/react';

import { deleteUserRequest } from '@/api/userService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/users-messages';
import useDeleteUser from '@/hooks/users/useDeleteUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { UserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_USER = UserFactory.create();

const mockDeleteUserRequest = deleteUserRequest as jest.Mock<Promise<boolean>>;
jest.mock('@/api/userService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useDeleteUser(), { wrapper: renderHookWithProviders(options) });

describe('hooks/users/useDeleteUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the user', async () => {
    // Arrange
    mockDeleteUserRequest.mockReturnValueOnce(Promise.resolve(true));

    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate({ id: DUMMY_USER._id });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockDeleteUserRequest).toBeCalledWith({ id: DUMMY_USER._id });
    expect(recoilHandler).toHaveBeenCalledWith(createSuccessMessage(SuccessMessages.DELETE));
  });

  it('should throw an error', async () => {
    // Arrange
    mockDeleteUserRequest.mockImplementationOnce(() => {
      throw new Error('Failed to update the user');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate({ id: DUMMY_USER._id });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.DELETE));
    });
  });
});

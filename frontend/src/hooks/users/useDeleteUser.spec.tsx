import { renderHook, waitFor } from '@testing-library/react';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { UserFactory } from '@/utils/factories/user';
import { deleteUserRequest } from '@/api/userService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useDeleteUser from '@/hooks/users/useDeleteUser';

const DUMMY_USER = UserFactory.create();

const mockDeleteUserRequest = deleteUserRequest as jest.Mock<Promise<Boolean>>;
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
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'The user was successfully updated.',
      type: ToastStateEnum.SUCCESS,
    });
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
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error while deleting the user',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});

import { renderHook, waitFor } from '@testing-library/react';

import { updateUserIsAdminRequest } from '@/api/userService';
import useUpdateUser from '@/hooks/users/useUpdateUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { User } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { UserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_USER = UserFactory.create();

const mockUpdateUserIsAdminRequest = updateUserIsAdminRequest as jest.Mock<Promise<User>>;
jest.mock('@/api/userService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUpdateUser(), { wrapper: renderHookWithProviders(options) });

describe('hooks/users/useUpdateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the user', async () => {
    // Arrange
    mockUpdateUserIsAdminRequest.mockReturnValueOnce(
      Promise.resolve({ ...DUMMY_USER, isSAdmin: !DUMMY_USER.isSAdmin }),
    );

    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    const updateUserIsAdmin = { _id: DUMMY_USER._id, isSAdmin: !DUMMY_USER.isSAdmin };
    result.current.mutate(updateUserIsAdmin);

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockUpdateUserIsAdminRequest).toBeCalledWith(updateUserIsAdmin);
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'The team user was successfully updated.',
      type: ToastStateEnum.SUCCESS,
    });
  });

  it('should throw an error', async () => {
    // Arrange
    mockUpdateUserIsAdminRequest.mockImplementationOnce(() => {
      throw new Error('Failed to update the user');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    const updateUserIsAdmin = { _id: DUMMY_USER._id, isSAdmin: !DUMMY_USER.isSAdmin };
    result.current.mutate(updateUserIsAdmin);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error while updating the user',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});

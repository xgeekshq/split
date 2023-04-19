import { renderHook, waitFor } from '@testing-library/react';

import { getAllUsers } from '@/api/userService';
import useUsers from '@/hooks/users/useUsers';
import { toastState } from '@/store/toast/atom/toast.atom';
import { User } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { UserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_USERS = UserFactory.createMany(3);

const mockGetAllUsers = getAllUsers as jest.Mock<Promise<User[]>>;
jest.mock('@/api/userService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUsers(), { wrapper: renderHookWithProviders(options) });

describe('hooks/users/useUsers', () => {
  beforeEach(() => {
    mockGetAllUsers.mockReturnValue(Promise.resolve(DUMMY_USERS));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the users', async () => {
    // Act
    const { result } = render();

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(result.current.data).toBe(DUMMY_USERS);
  });

  it('should set toast error', async () => {
    // Arrange
    mockGetAllUsers.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch users')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});

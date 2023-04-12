import { renderHook, waitFor } from '@testing-library/react';
import useUsers from '@/hooks/users/useUsers';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { UserFactory } from '@/utils/factories/user';
import { getAllUsers } from '@/api/userService';
import { User } from '@/types/user/user';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

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
    mockGetAllUsers.mockReturnValueOnce(Promise.reject(new Error('failed to fetch users')));
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

import { renderHook, waitFor } from '@testing-library/react';

import { getUser } from '@/api/userService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/users-messages';
import useUser from '@/hooks/users/useUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { User } from '@/types/user/user';
import { UserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_USER = UserFactory.create();

const mockGetUser = getUser as jest.Mock<Promise<User>>;
jest.mock('@/api/userService');

const render = (userId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUser(userId), { wrapper: renderHookWithProviders(options) });

describe('hooks/users/useUser', () => {
  beforeEach(() => {
    mockGetUser.mockReturnValue(Promise.resolve(DUMMY_USER));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the user', async () => {
    // Act
    const { result } = render(DUMMY_USER._id);

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(result.current.data).toBe(DUMMY_USER);
  });

  it('should set toast error', async () => {
    // Arrange
    mockGetUser.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch user')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(DUMMY_USER._id, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.GET_ONE));
    });
  });
});

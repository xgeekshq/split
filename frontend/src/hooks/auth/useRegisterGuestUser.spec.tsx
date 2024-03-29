import { renderHook, waitFor } from '@testing-library/react';
import { setCookie } from 'cookies-next';

import { registerGuest } from '@/api/authService';
import { GUEST_USER_COOKIE } from '@/constants';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/auth-messages';
import useRegisterGuestUser from '@/hooks/auth/useRegisterGuestUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { GuestUser } from '@/types/user/user';
import { BoardFactory } from '@/utils/factories/board';
import { UserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_USER = UserFactory.create();
const DUMMY_CREATE_GUEST_USER = {
  firstName: DUMMY_USER.firstName,
  lastName: DUMMY_USER.lastName,
  board: BoardFactory.create()._id,
};
const DUMMY_GUEST_USER = {
  accessToken: {
    token: '123',
    expiresIn: '123',
  },
  user: DUMMY_USER._id,
};

const mockUseRegisterGuestUser = registerGuest as jest.Mock<Promise<GuestUser>>;
jest.mock('@/api/authService');

const mockSetCookie = setCookie as jest.Mock;
jest.mock('cookies-next');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useRegisterGuestUser(), { wrapper: renderHookWithProviders(options) });

describe('hooks/auth/useRegisterGuestUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a guest user', async () => {
    // Arrange
    mockUseRegisterGuestUser.mockReturnValueOnce(Promise.resolve(DUMMY_GUEST_USER));
    mockSetCookie.mockImplementationOnce(jest.fn());

    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate(DUMMY_CREATE_GUEST_USER);

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockUseRegisterGuestUser).toBeCalledWith(DUMMY_CREATE_GUEST_USER);
    expect(mockSetCookie).toBeCalledWith(GUEST_USER_COOKIE, DUMMY_GUEST_USER);
  });

  it('should throw an error', async () => {
    // Arrange
    mockUseRegisterGuestUser.mockImplementationOnce(() => {
      throw new Error('Failed to reset the password');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate(DUMMY_CREATE_GUEST_USER);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.GUEST_USER));
    });
  });
});

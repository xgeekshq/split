import { renderHook, waitFor } from '@testing-library/react';

import { resetUserPassword } from '@/api/authService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/auth-messages';
import useResetPassword from '@/hooks/auth/useResetPassword';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ResetPasswordResponse } from '@/types/user/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_PASSWORD = {
  newPassword: '123',
  newPasswordConf: '123',
  token: '123',
};

const mockResetUserPassword = resetUserPassword as jest.Mock<Promise<ResetPasswordResponse>>;
jest.mock('@/api/authService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useResetPassword(), { wrapper: renderHookWithProviders(options) });

describe('hooks/auth/useResetPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should reset the user's password", async () => {
    // Arrange
    mockResetUserPassword.mockReturnValueOnce(
      Promise.resolve({ message: 'Password updated successfully!' }),
    );

    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate(DUMMY_PASSWORD);

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockResetUserPassword).toBeCalledWith(DUMMY_PASSWORD);
    expect(recoilHandler).toHaveBeenCalledWith(
      createSuccessMessage(SuccessMessages.RESET_PASSWORD),
    );
  });

  it('should throw an error', async () => {
    // Arrange
    mockResetUserPassword.mockImplementationOnce(() => {
      throw new Error('Failed to reset the password');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate(DUMMY_PASSWORD);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.RESET_PASSWORD));
    });
  });
});

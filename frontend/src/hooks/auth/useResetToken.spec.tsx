import { renderHook, waitFor } from '@testing-library/react';

import { resetTokenEmail } from '@/api/authService';
import { createInfoMessage } from '@/constants/toasts';
import { ForgotPassword, InfoMessages } from '@/constants/toasts/auth-messages';
import useResetToken from '@/hooks/auth/useResetToken';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ResetTokenResponse } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { UserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_USER = UserFactory.create();

const mockRestTokenEmail = resetTokenEmail as jest.Mock<Promise<ResetTokenResponse>>;
jest.mock('@/api/authService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useResetToken(), { wrapper: renderHookWithProviders(options) });

describe('hooks/auth/useResetToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email to the user', async () => {
    // Arrange
    mockRestTokenEmail.mockReturnValueOnce(
      Promise.resolve({ message: ForgotPassword.SENT_RECENTLY }),
    );

    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate({ email: DUMMY_USER.email });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockRestTokenEmail).toBeCalledWith({ email: DUMMY_USER.email });
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'Email was sent recently please wait 1 minute and try again',
      type: ToastStateEnum.INFO,
    });
  });

  it('should resend an email to the user', async () => {
    // Arrange
    mockRestTokenEmail.mockReturnValueOnce(
      Promise.resolve({ message: ForgotPassword.CHECK_EMAIL }),
    );

    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    result.current.mutate({ email: DUMMY_USER.email });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockRestTokenEmail).toBeCalledWith({ email: DUMMY_USER.email });
    expect(recoilHandler).toHaveBeenCalledWith(
      createInfoMessage(InfoMessages.RESET_TOKEN(ForgotPassword.CHECK_EMAIL)),
    );
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { UserFactory } from '@/utils/factories/user';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useResetToken from '@/hooks/auth/useResetToken';
import { resetTokenEmail } from '@/api/authService';
import { ResetTokenResponse } from '@/types/user/user';
import { ForgotPassword } from '@/utils/constants/forgotPassword';

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
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'Another link was sent to your email',
      type: ToastStateEnum.INFO,
    });
  });
});

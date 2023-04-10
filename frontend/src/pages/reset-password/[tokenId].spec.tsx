import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react';
import useResetPassword from '@/hooks/auth/useResetPassword';
import { libraryMocks } from '@/utils/testing/mocks';
import ResetPasswordPage from '@/pages/reset-password/[tokenId]';
import { UseMutationResult } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

const mockUseResetPassword = useResetPassword as jest.Mock<Partial<UseMutationResult>>;
jest.mock('@/hooks/auth/useResetPassword');

const { mockRouter } = libraryMocks.mockNextRouter({
  pathname: '/reset-password/[tokenId]',
  query: { tokenId: '[tokenId]' },
});

const render = () => renderWithProviders(<ResetPasswordPage />, { routerOptions: mockRouter });

describe('Pages/reset-password/[tokenId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseResetPassword.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);

    // Act
    const { getByText } = render();
    const recoverPasswordBtn = getByText('Recover password');

    // Assert
    expect(getByText('Reset Password')).toBeInTheDocument();
    expect(getByText('Type new password here')).toBeInTheDocument();
    expect(getByText('Repeat password')).toBeInTheDocument();
    expect(recoverPasswordBtn).toBeInTheDocument();
  });

  it('should handle the password recovery', async () => {
    // Arrange
    const mockedMutateFn = jest.fn();
    mockUseResetPassword.mockReturnValue({
      mutate: mockedMutateFn,
    } as Partial<UseMutationResult>);

    // Act
    const { getByText } = render();
    const newPassword = getByText('Type new password here');
    const newPasswordConfirmation = getByText('Repeat password');
    const recoverPasswordBtn = getByText('Recover password');

    // Assert
    expect(recoverPasswordBtn).toBeInTheDocument();
    expect(newPassword).toBeInTheDocument();
    expect(newPasswordConfirmation).toBeInTheDocument();

    await userEvent.type(newPassword, '1Potato!');
    await userEvent.type(newPasswordConfirmation, '1Potato!');
    fireEvent.click(recoverPasswordBtn);

    await waitFor(() => {
      expect(mockedMutateFn).toBeCalled();
    });
  });
});

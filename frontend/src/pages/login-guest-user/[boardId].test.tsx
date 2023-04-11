import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react';
import { libraryMocks } from '@/utils/testing/mocks';
import { UseMutationResult } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import LoginGuestUserPage from '@/pages/login-guest-user/[boardId]';
import useRegisterGuestUser from '@/hooks/auth/useRegisterGuestUser';
import { START_PAGE_ROUTE } from '@/utils/routes';
import { getUsername } from '@/utils/getUsername';

const mockUseRegisterGuestUser = useRegisterGuestUser as jest.Mock<Partial<UseMutationResult>>;
jest.mock('@/hooks/auth/useRegisterGuestUser');

const { mockRouter } = libraryMocks.mockNextRouter({
  pathname: '/login-guest-user/[boardId]',
  query: { boardId: '[boardId]' },
});

const render = () => renderWithProviders(<LoginGuestUserPage />, { routerOptions: mockRouter });

describe('Pages/login-guest-user/[boardId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseRegisterGuestUser.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);

    // Act
    const { getByText } = render();
    const loginAsGuestBtn = getByText('Log in as guest');
    const signInBtn = getByText('Sign In');

    // Assert
    expect(getByText('Guest User')).toBeInTheDocument();
    expect(getByText('Guest user name')).toBeInTheDocument();
    expect(loginAsGuestBtn).toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });

  it('should handle the guest user login', async () => {
    // Arrange
    const mockedMutateFn = jest.fn();
    mockUseRegisterGuestUser.mockReturnValue({
      mutate: mockedMutateFn,
    } as Partial<UseMutationResult>);

    // Act
    const { getByText } = render();
    const guestUserName = getByText('Guest user name');
    const loginAsGuestBtn = getByText('Log in as guest');

    // Assert
    expect(loginAsGuestBtn).toBeInTheDocument();
    expect(guestUserName).toBeInTheDocument();

    await userEvent.type(guestUserName, 'Guest User');
    const guestUser = getUsername('Guest User');
    fireEvent.click(loginAsGuestBtn);

    await waitFor(() => {
      expect(mockedMutateFn).toBeCalledWith(
        {
          board: '[boardId]',
          ...guestUser,
        },
        expect.anything(),
      );
    });
  });

  it('should redirect to the sign in page', async () => {
    const { getByText } = render();
    const signInBtn = getByText('Sign In');

    // Assert
    expect(signInBtn).toBeInTheDocument();

    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(START_PAGE_ROUTE);
    });
  });
});

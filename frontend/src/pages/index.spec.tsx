import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react';
import Home from '@/pages/index';
import { libraryMocks } from '@/utils/testing/mocks';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });

const render = () => renderWithProviders(<Home />, { routerOptions: mockRouter });

describe('Pages/Home', () => {
  it('should render correctly', () => {
    // Act
    const { getByText } = render();
    const loginBtn = getByText('Log in');
    const forgotPasswordBtn = getByText('Forgot password');
    const signUpBtn = getByText('Sign up.');

    // Assert
    expect(getByText('Welcome')).toBeInTheDocument();

    expect(getByText('Email address')).toBeInTheDocument();
    expect(getByText('Password')).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
    expect(forgotPasswordBtn).toBeInTheDocument();

    expect(signUpBtn).toBeInTheDocument();
  });

  it('should render forgot password correctly', async () => {
    // Act
    const { getByText } = render();
    const wellcome = getByText('Welcome');
    const forgotPasswordBtn = getByText('Forgot password');

    // Assert
    expect(wellcome).toBeInTheDocument();
    expect(forgotPasswordBtn).toBeInTheDocument();

    fireEvent.click(forgotPasswordBtn);

    await waitFor(() => {
      expect(wellcome).not.toBeInTheDocument();

      expect(getByText('Trouble logging in?')).toBeInTheDocument();
      expect(getByText('Email address')).toBeInTheDocument();
      expect(getByText('Recover password')).toBeInTheDocument();

      expect(getByText('Go Back')).toBeInTheDocument();
    });
  });

  it('should render sign up correctly', async () => {
    // Act
    const { getByText } = render();
    const wellcome = getByText('Welcome');
    const signUpBtn = getByText('Sign up.');

    // Assert
    expect(wellcome).toBeInTheDocument();
    expect(signUpBtn).toBeInTheDocument();

    fireEvent.click(signUpBtn);

    await waitFor(() => {
      const logInBtn = getByText('Log in.');

      expect(wellcome).not.toBeInTheDocument();

      expect(getByText('Sign up')).toBeInTheDocument();
      expect(getByText('Email address')).toBeInTheDocument();
      expect(getByText('Get Started')).toBeInTheDocument();

      expect(logInBtn).toBeInTheDocument();
    });
  });
});

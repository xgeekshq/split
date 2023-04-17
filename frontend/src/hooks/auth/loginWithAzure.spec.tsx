import { signIn } from 'next-auth/react';

import loginWithAzure from '@/hooks/auth/loginWithAzure';
import { DASHBOARD_ROUTE } from '@/utils/routes';

const mockSignIn = signIn as jest.Mock;
jest.mock('next-auth/react');

describe('hooks/auth/loginWithAzure', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next's signIn function", async () => {
    // Arrange
    mockSignIn.mockImplementationOnce(jest.fn());

    // Act
    loginWithAzure();

    // Assert
    expect(mockSignIn).toBeCalledWith('azure-ad', {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: true,
    });
  });
});

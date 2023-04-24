import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import UserTitle, {
  UserTitleProps,
} from '@/components/Users/UsersList/UserItem/UserTitle/UserTitle';
import { ROUTES } from '@/constants/routes';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });
const render = (props: Partial<UserTitleProps> = {}) =>
  renderWithProviders(<UserTitle hasPermissions={false} user={UserFactory.create()} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Users/User/UsersList/UserItem/UserTitle', () => {
  it('should render correctly', () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getByText } = render({ user });

    // Assert
    expect(getByText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
  });

  it('should redirect to user page', async () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getByText } = render({ user, hasPermissions: true });

    fireEvent.click(getByText(`${user.firstName} ${user.lastName}`));

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.UserPage(user._id),
        ROUTES.UserPage(user._id),
        expect.anything(),
      );
    });
  });
});

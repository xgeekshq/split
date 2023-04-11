import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserFactory } from '@/utils/factories/user';
import UserTitle, {
  UserTitleProps,
} from '@/components/Users/UsersList/UserItem/UserTitle/UserTitle';
import { ROUTES } from '@/utils/routes';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });
const render = (props: Partial<UserTitleProps> = {}) =>
  renderWithProviders(<UserTitle user={UserFactory.create()} hasPermissions={false} {...props} />, {
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

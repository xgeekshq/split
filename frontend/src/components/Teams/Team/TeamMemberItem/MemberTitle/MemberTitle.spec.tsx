import { fireEvent, waitFor } from '@testing-library/react';

import MemberTitle, {
  MemberTitleProps,
} from '@/components/Teams/Team/TeamMemberItem/MemberTitle/MemberTitle';
import { ROUTES } from '@/constants/routes';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: Partial<MemberTitleProps>) =>
  renderWithProviders(<MemberTitle hasPermissions={false} name="User" userId="123" {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Teams/Team/TeamMemberItem/MemberTitle', () => {
  it('should render correctly', () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getByText } = render({ name: user.firstName });

    // Assert
    expect(getByText(user.firstName)).toBeInTheDocument();
  });

  it('should redirect to user page', async () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getByText } = render({ name: user.firstName, userId: user._id, hasPermissions: true });
    fireEvent.click(getByText(user.firstName));

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

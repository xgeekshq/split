import { fireEvent, waitFor } from '@testing-library/react';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserFactory } from '@/utils/factories/user';
import MemberTitle, {
  MemberTitleProps,
} from '@/components/Teams/Team/TeamMemberItem/MemberTitle/MemberTitle';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: Partial<MemberTitleProps>) =>
  renderWithProviders(<MemberTitle name="User" userId="123" hasPermissions={false} {...props} />, {
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

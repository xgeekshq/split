import { fireEvent, waitFor } from '@testing-library/react';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserFactory } from '@/utils/factories/user';
import MemberTitle, { MemberTitleProps } from './MemberTitle';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const render = (props: MemberTitleProps) =>
  renderWithProviders(<MemberTitle {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/Team/TeamMemberItem/MemberTitle', () => {
  let defaultProps: MemberTitleProps;
  beforeEach(() => {
    const user = UserFactory.create();
    defaultProps = { name: user.firstName, userId: user._id, hasPermissions: false };
  });

  it('should render correctly', () => {
    // Arrange
    const memberTitleProps = { ...defaultProps };

    // Act
    const { getByText } = render(memberTitleProps);

    // Assert
    expect(getByText(memberTitleProps.name)).toBeInTheDocument();
  });

  it('should redirect to user page', async () => {
    // Arrange
    const memberTitleProps = { ...defaultProps, hasPermissions: true };

    // Act
    const { getByText } = render(memberTitleProps);
    fireEvent.click(getByText(memberTitleProps.name));

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        ROUTES.UserPage(memberTitleProps.userId),
        ROUTES.UserPage(memberTitleProps.userId),
        expect.anything(),
      );
    });
  });
});

import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserListFactory } from '@/utils/factories/user';
import UserCheckbox, { UserCheckboxProps } from './UserCheckbox';

const router = createMockRouter({});

const render = (props: Partial<UserCheckboxProps> = {}) =>
  renderWithProviders(
    <UserCheckbox
      user={UserListFactory.create()}
      disabled={false}
      handleChecked={jest.fn()}
      {...props}
    />,
    { routerOptions: router },
  );

describe('Components/Primitives/Checkboxes/UserCheckbox', () => {
  it('should render correctly', () => {
    // Arrange
    const user = UserListFactory.create({ isChecked: true });

    // Act
    const { getByText, getByTestId, getByRole } = render({ user });

    // Assert
    expect(getByText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
    expect(getByText(user.email)).toBeInTheDocument();
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toBeChecked();
  });
});

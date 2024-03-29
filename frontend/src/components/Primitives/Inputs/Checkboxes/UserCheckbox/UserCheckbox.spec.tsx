import UserCheckbox, {
  UserCheckboxProps,
} from '@/components/Primitives/Inputs/Checkboxes/UserCheckbox/UserCheckbox';
import { UserListFactory } from '@/utils/factories/user';
import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const router = createMockRouter({});

const render = (props: Partial<UserCheckboxProps> = {}) =>
  renderWithProviders(
    <UserCheckbox
      disabled={false}
      handleChecked={jest.fn()}
      user={UserListFactory.create()}
      {...props}
    />,
    { routerOptions: router },
  );

describe('Components/Primitives/Inputs/Checkboxes/UserCheckbox', () => {
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

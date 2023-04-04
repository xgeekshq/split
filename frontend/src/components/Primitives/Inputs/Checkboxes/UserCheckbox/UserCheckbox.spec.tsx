import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserListFactory } from '@/utils/factories/user';
import UserCheckbox, {
  UserCheckboxProps,
} from '@/components/Primitives/Inputs/Checkboxes/UserCheckbox/UserCheckbox';

const DEFAULT_PROPS = {
  user: UserListFactory.create({ isChecked: true }),
  disabled: false,
  handleChecked: jest.fn(),
};

const router = createMockRouter({});

const render = (props: UserCheckboxProps = DEFAULT_PROPS) =>
  renderWithProviders(<UserCheckbox {...props} />, { routerOptions: router });

describe('Components/Primitives/Checkboxes/UserCheckbox', () => {
  it('should render correctly', () => {
    // Arrange
    const testProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getByTestId, getByRole } = render(testProps);

    // Assert
    expect(getByText(`${testProps.user.firstName} ${testProps.user.lastName}`)).toBeInTheDocument();
    expect(getByText(testProps.user.email)).toBeInTheDocument();
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toBeChecked();
  });
});

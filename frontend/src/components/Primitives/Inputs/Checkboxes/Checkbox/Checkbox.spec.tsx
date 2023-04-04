import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import Checkbox, {
  CheckboxProps,
} from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';

const render = (props: CheckboxProps) => renderWithProviders(<Checkbox {...props} />);

describe('Components/Primitives/Checkboxes/Checkbox', () => {
  it('should render correctly', () => {
    // Arrange
    const checkboxProps: CheckboxProps = { id: 'checkbox', label: 'Label', size: 'sm' };

    // Act
    const { getByTestId, getByText } = render(checkboxProps);

    // Assert
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByText(checkboxProps.label!)).toBeInTheDocument();
  });

  it('should render checked state', () => {
    // Arrange
    const checkboxProps: CheckboxProps = {
      id: 'checkbox',
      label: 'Label',
      size: 'sm',
      checked: true,
    };

    // Act
    const { getByTestId, getByRole } = render(checkboxProps);

    // Assert
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toBeChecked();
  });

  it('should handle checkedChange function', async () => {
    // Arrange
    const mockHandleChangeFn = jest.fn();
    const checkboxProps: CheckboxProps = {
      id: 'checkbox',
      label: 'Label',
      size: 'sm',
      checked: false,
      handleChange: mockHandleChangeFn,
    };

    // Act
    const { getByTestId, getByRole } = render(checkboxProps);

    // Assert
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByRole('checkbox')).not.toBeChecked();

    fireEvent.click(getByRole('checkbox'));

    await waitFor(() => {
      expect(mockHandleChangeFn).toBeCalled();
    });
  });
});

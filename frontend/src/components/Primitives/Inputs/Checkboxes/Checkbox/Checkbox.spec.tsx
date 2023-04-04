import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import Checkbox, { CheckboxProps } from './Checkbox';

const render = (props: Partial<CheckboxProps> = {}) =>
  renderWithProviders(<Checkbox id="checkbox" size="sm" {...props} />);

describe('Components/Primitives/Inputs/Checkboxes/Checkbox', () => {
  it('should render correctly', () => {
    // Arrange
    const label = 'Label';

    // Act
    const { getByTestId, getByText } = render({ label });

    // Assert
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByText(label)).toBeInTheDocument();
  });

  it('should render checked state', () => {
    // Act
    const { getByTestId, getByRole } = render({ checked: true });

    // Assert
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByRole('checkbox')).toBeChecked();
  });

  it('should handle checkedChange function', async () => {
    // Arrange
    const handleChange = jest.fn();

    // Act
    const { getByTestId, getByRole } = render({ handleChange });

    // Assert
    expect(getByTestId('checkBox')).toBeInTheDocument();
    expect(getByRole('checkbox')).not.toBeChecked();

    fireEvent.click(getByRole('checkbox'));

    await waitFor(() => {
      expect(handleChange).toBeCalled();
    });
  });
});

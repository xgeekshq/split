import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import Switch, { SwitchProps } from '@/components/Primitives/Inputs/Switches/Switch/Switch';

const render = (props: SwitchProps) => renderWithProviders(<Switch {...props} />);

describe('Components/Primitives/Switches/Switch', () => {
  it('should render correctly', () => {
    // Arrange
    const switchProps: SwitchProps = { checked: false };

    // Act
    const { getByTestId } = render(switchProps);

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
  });

  it('should render checked state', () => {
    // Arrange
    const switchProps: SwitchProps = { checked: true };

    // Act
    const { getByTestId, getByRole } = render(switchProps);

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).toBeChecked();
  });

  it('should handle checkedChange function', async () => {
    // Arrange
    const mockHandleChangeFn = jest.fn();
    const checkboxProps: SwitchProps = {
      checked: false,
      onCheckedChange: mockHandleChangeFn,
    };

    // Act
    const { getByTestId, getByRole } = render(checkboxProps);

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).not.toBeChecked();

    fireEvent.click(getByRole('switch'));

    await waitFor(() => {
      expect(mockHandleChangeFn).toBeCalled();
    });
  });
});

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import Switch, { SwitchProps } from '@/components/Primitives/Inputs/Switches/Switch/Switch';

const render = (props: Partial<SwitchProps> = {}) =>
  renderWithProviders(<Switch checked={false} {...props} />);

describe('Components/Primitives/Inputs/Switches/Switch', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
  });

  it('should render checked state', () => {
    // Act
    const { getByTestId, getByRole } = render({ checked: true });

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).toBeChecked();
  });

  it('should handle checkedChange function', async () => {
    // Arrange
    const onCheckedChange = jest.fn();

    // Act
    const { getByTestId, getByRole } = render({ onCheckedChange });

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).not.toBeChecked();

    fireEvent.click(getByRole('switch'));

    await waitFor(() => {
      expect(onCheckedChange).toBeCalled();
    });
  });
});

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import ConfigurationSwitch, { ConfigurationSwitchProps } from './ConfigurationSwitch';

const render = (props: Partial<ConfigurationSwitchProps> = {}) =>
  renderWithProviders(
    <ConfigurationSwitch
      title="Title"
      isChecked={false}
      handleCheckedChange={jest.fn()}
      {...props}
    />,
  );

describe('Components/Primitives/Switches/ConfigurationSwitch', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId, getByText } = render();

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByText('Title')).toBeInTheDocument();
  });

  it('should render checked state', () => {
    // Act
    const { getByTestId, getByRole } = render({ isChecked: true });

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).toBeChecked();
  });

  it('should handle checkedChange function', async () => {
    // Arrange
    const handleCheckedChange = jest.fn();

    // Act
    const { getByTestId, getByRole } = render({ handleCheckedChange });

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).not.toBeChecked();

    fireEvent.click(getByRole('switch'));

    await waitFor(() => {
      expect(handleCheckedChange).toBeCalled();
    });
  });
});

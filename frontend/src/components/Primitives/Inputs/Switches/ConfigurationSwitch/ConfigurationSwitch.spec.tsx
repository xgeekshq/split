import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import ConfigurationSwitch, { ConfigurationSwitchProps } from './ConfigurationSwitch';

const render = (props: ConfigurationSwitchProps) =>
  renderWithProviders(<ConfigurationSwitch {...props} />);

describe('Components/Primitives/Switches/ConfigurationSwitch', () => {
  it('should render correctly', () => {
    // Arrange
    const mockHandleFn = jest.fn();
    const configurationSwitchProps: ConfigurationSwitchProps = {
      title: 'Title',
      isChecked: false,
      handleCheckedChange: mockHandleFn,
    };

    // Act
    const { getByTestId, getByText } = render(configurationSwitchProps);

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByText(configurationSwitchProps.title)).toBeInTheDocument();
  });

  it('should render checked state', () => {
    // Arrange
    const mockHandleFn = jest.fn();
    const configurationSwitchProps: ConfigurationSwitchProps = {
      title: 'Title',
      isChecked: true,
      handleCheckedChange: mockHandleFn,
    };

    // Act
    const { getByTestId, getByRole } = render(configurationSwitchProps);

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).toBeChecked();
  });

  it('should handle checkedChange function', async () => {
    // Arrange
    const mockHandleFn = jest.fn();
    const configurationSwitchProps: ConfigurationSwitchProps = {
      title: 'Title',
      isChecked: false,
      handleCheckedChange: mockHandleFn,
    };

    // Act
    const { getByTestId, getByRole } = render(configurationSwitchProps);

    // Assert
    expect(getByTestId('switch')).toBeInTheDocument();
    expect(getByRole('switch')).not.toBeChecked();

    fireEvent.click(getByRole('switch'));

    await waitFor(() => {
      expect(mockHandleFn).toBeCalled();
    });
  });
});

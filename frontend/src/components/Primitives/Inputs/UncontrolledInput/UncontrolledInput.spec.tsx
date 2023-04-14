import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import UncontrolledInput, {
  UncontrolledInputProps,
} from '@/components/Primitives/Inputs/UncontrolledInput/UncontrolledInput';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const render = (props: Partial<UncontrolledInputProps> = {}) =>
  renderWithProviders(<UncontrolledInput placeholder="Placeholder" {...props} />);

describe('Components/Primitives/Inputs/UncontrolledInput', () => {
  it('should render correctly', () => {
    // Act
    const { getByText, getByLabelText } = render({
      currentValue: 'Value',
    });

    const searchInput = getByLabelText('Placeholder');

    // Assert
    expect(getByText('Placeholder')).toBeInTheDocument();
    expect(searchInput).toHaveValue('Value');
  });

  it('should handle handleChange function', async () => {
    // Arrange
    const handleChange = jest.fn();

    // Act
    const { getByLabelText } = render({ handleChange });

    const searchInput = getByLabelText('Placeholder');
    userEvent.type(searchInput, 'My Other Board');

    // Assert
    await waitFor(() => {
      expect(handleChange).toBeCalled();
    });
  });

  it('should handle handleChange function', async () => {
    // Arrange
    const handleClear = jest.fn();

    // Act
    const { getByTestId } = render({ handleClear });

    fireEvent.click(getByTestId('uncontrolledInputClear'));

    // Assert
    await waitFor(() => {
      expect(handleClear).toBeCalled();
    });
  });
});

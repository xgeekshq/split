import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import SearchInput, {
  SearchInputProps,
} from '@/components/Primitives/Inputs/SearchInput/SearchInput';
import userEvent from '@testing-library/user-event';

const render = (props: Partial<SearchInputProps> = {}) =>
  renderWithProviders(
    <SearchInput placeholder="Placeholder" handleChange={jest.fn()} {...props} />,
  );

describe('Components/Primitives/Inputs/SearchInput', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId, getByText, getByLabelText } = render({
      currentValue: 'Value',
    });

    const searchInput = getByLabelText('Placeholder');

    // Assert
    expect(getByTestId('searchInputClear')).toBeInTheDocument();
    expect(getByText('Placeholder')).toBeInTheDocument();
    expect(searchInput).toHaveValue('Value');
  });

  it('should handle handleChange function', async () => {
    // Arrange
    const handleChange = jest.fn();

    // Act
    const { getByLabelText } = render({ handleChange });

    const searchInput = getByLabelText('Placeholder');
    await userEvent.type(searchInput, 'My Other Board');

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

    fireEvent.click(getByTestId('searchInputClear'));

    // Assert
    await waitFor(() => {
      expect(handleClear).toBeCalled();
    });
  });
});

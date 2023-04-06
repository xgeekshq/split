import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import CreateHeader, {
  CreateHeaderProps,
} from '@/components/Primitives/Layout/CreateHeader/CreateHeader';

const render = (props: Partial<CreateHeaderProps> = {}) =>
  renderWithProviders(
    <CreateHeader title="Title" disableBack={false} handleBack={jest.fn()} {...props} />,
  );

describe('Components/Primitives/Layout/CreateHeader', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId, getByText } = render();

    // Assert
    expect(getByTestId('createHeader')).toBeInTheDocument();
    expect(getByText('Title')).toBeInTheDocument();
    expect(getByTestId('createHeader').querySelector('button')).toBeInTheDocument();
  });

  it('should disable the back button', () => {
    // Act
    const { getByTestId } = render({ disableBack: true });

    // Assert
    expect(getByTestId('createHeader').querySelector('button')).toBeDisabled();
  });

  it('should call function to handle back', async () => {
    // Arrange
    const handleBack = jest.fn();

    // Act
    const { getByTestId } = render({ handleBack });
    fireEvent.click(getByTestId('createHeader').querySelector('button')!);

    // Assert
    await waitFor(() => {
      expect(handleBack).toBeCalled();
    });
  });
});

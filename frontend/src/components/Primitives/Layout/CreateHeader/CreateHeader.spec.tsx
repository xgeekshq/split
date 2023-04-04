import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import CreateHeader, {
  CreateHeaderProps,
} from '@/components/Primitives/Layout/CreateHeader/CreateHeader';

const DEFAULT_PROPS: CreateHeaderProps = {
  title: 'Create New Lorem',
  disableBack: false,
  handleBack: jest.fn(),
};

const render = (props: CreateHeaderProps) => renderWithProviders(<CreateHeader {...props} />);

describe('Components/Primitives/Layout/CreateHeader', () => {
  it('should render correctly', () => {
    // Arrange
    const createHeaderProps: CreateHeaderProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getByText } = render(createHeaderProps);

    // Assert
    expect(getByTestId('createHeader')).toBeInTheDocument();
    expect(getByText(createHeaderProps.title)).toBeInTheDocument();
    expect(getByTestId('createHeader').querySelector('button')).toBeInTheDocument();
  });

  it('should disable the back button', () => {
    // Arrange
    const createHeaderProps: CreateHeaderProps = { ...DEFAULT_PROPS, disableBack: true };

    // Act
    const { getByTestId } = render(createHeaderProps);

    // Assert
    expect(getByTestId('createHeader').querySelector('button')).toBeDisabled();
  });

  it('should call function to handle back', async () => {
    // Arrange
    const mockHandleBack = jest.fn();
    const createHeaderProps: CreateHeaderProps = { ...DEFAULT_PROPS, handleBack: mockHandleBack };

    // Act
    const { getByTestId } = render(createHeaderProps);
    fireEvent.click(getByTestId('createHeader').querySelector('button')!);

    // Assert
    await waitFor(() => {
      expect(mockHandleBack).toBeCalled();
    });
  });
});

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import CreateFooter, { CreateFooterProps } from './CreateFooter';

const DEFAULT_PROPS: CreateFooterProps = {
  disableButton: false,
  hasError: false,
  handleBack: jest.fn(),
  formId: '',
  confirmationLabel: 'Lorem Ipsum',
};

const render = (props: CreateFooterProps) => renderWithProviders(<CreateFooter {...props} />);

describe('Components/Primitives/Layout/CreateFooter', () => {
  it('should render correctly', () => {
    // Arrange
    const createFooterProps: CreateFooterProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getByText } = render(createFooterProps);

    // Assert
    expect(getByTestId('createFooter')).toBeInTheDocument();
    expect(getByText(createFooterProps.confirmationLabel)).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should disable the buttons', () => {
    // Arrange
    const createFooterProps: CreateFooterProps = { ...DEFAULT_PROPS, disableButton: true };

    // Act
    const { getByText } = render(createFooterProps);

    // Assert
    expect(getByText(createFooterProps.confirmationLabel)).toBeDisabled();
    expect(getByText('Cancel')).toBeDisabled();
  });

  it('should disable the confirmation button', () => {
    // Arrange
    const createFooterProps: CreateFooterProps = { ...DEFAULT_PROPS, hasError: true };

    // Act
    const { getByText } = render(createFooterProps);

    // Assert
    expect(getByText(createFooterProps.confirmationLabel)).toBeDisabled();
    expect(getByText('Cancel')).not.toBeDisabled();
  });

  it('should call function to handle back', async () => {
    // Arrange
    const mockHandleBack = jest.fn();
    const createFooterProps: CreateFooterProps = { ...DEFAULT_PROPS, handleBack: mockHandleBack };

    // Act
    const { getByText } = render(createFooterProps);
    fireEvent.click(getByText('Cancel'));

    // Assert
    await waitFor(() => {
      expect(mockHandleBack).toBeCalled();
    });
  });
});

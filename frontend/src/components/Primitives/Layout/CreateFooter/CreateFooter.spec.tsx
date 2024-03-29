import { fireEvent, waitFor } from '@testing-library/dom';

import CreateFooter, {
  CreateFooterProps,
} from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const render = (props: Partial<CreateFooterProps> = {}) =>
  renderWithProviders(
    <CreateFooter
      confirmationLabel="Confirm"
      disableButton={false}
      formId="form"
      handleBack={jest.fn()}
      {...props}
    />,
  );

describe('Components/Primitives/Layout/CreateFooter', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId, getByText } = render();

    // Assert
    expect(getByTestId('createFooter')).toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should disable the buttons', () => {
    // Act
    const { getByText } = render({ disableButton: true });

    // Assert
    expect(getByText('Confirm')).toBeDisabled();
    expect(getByText('Cancel')).toBeDisabled();
  });

  it('should disable the confirmation button', () => {
    // Act
    const { getByText } = render({ hasError: true });

    // Assert
    expect(getByText('Confirm')).toBeDisabled();
    expect(getByText('Cancel')).not.toBeDisabled();
  });

  it('should call function to handle back', async () => {
    // Arrange
    const handleBack = jest.fn();

    // Act
    const { getByText } = render({ handleBack });
    fireEvent.click(getByText('Cancel'));

    // Assert
    await waitFor(() => {
      expect(handleBack).toBeCalled();
    });
  });
});

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react';

import ConfirmationDialog, { ConfirmationDialogProps } from './ConfirmationDialog';
import Button from './Button';

const render = (props: Partial<ConfirmationDialogProps> = {}) =>
  renderWithProviders(
    <ConfirmationDialog
      trigger={<Button>Trigger</Button>}
      title="Title"
      description="Description"
      confirmationHandler={jest.fn()}
      confirmationLabel="Confirm"
      {...props}
    />,
  );

describe('Components/Primitives/ConfirmationDialog', () => {
  it('should render trigger correctly', () => {
    // Act
    const { getByRole } = render();

    // Assert
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should render dialog when trigger is clicked', async () => {
    // Act
    const { getByRole, getByText } = render();

    // Assert
    expect(getByRole('button')).toBeInTheDocument();

    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('alertdialog')).toBeInTheDocument();
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Confirm')).toBeInTheDocument();
    });
  });

  it('should call handler function when confirmation button is clicked', async () => {
    // Arrange
    const mockConfirmationHandler = jest.fn();

    // Act
    const { getByRole, getByText } = render({ confirmationHandler: mockConfirmationHandler });

    // Assert
    expect(getByRole('button')).toBeInTheDocument();

    fireEvent.click(getByRole('button'));

    await waitFor(async () => {
      expect(getByRole('alertdialog')).toBeInTheDocument();

      fireEvent.click(getByText('Confirm'));

      expect(mockConfirmationHandler).toBeCalled();
    });
  });
});

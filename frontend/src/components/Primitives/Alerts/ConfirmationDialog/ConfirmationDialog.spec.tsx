import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmationDialog, {
  ConfirmationDialogProps,
} from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Button from '@/components/Primitives/Inputs/Button/Button';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const render = (props: Partial<ConfirmationDialogProps> = {}) =>
  renderWithProviders(
    <ConfirmationDialog
      confirmationHandler={jest.fn()}
      confirmationLabel="Confirm"
      description="Description"
      title="Title"
      {...props}
    >
      <Button>Trigger</Button>
    </ConfirmationDialog>,
  );

describe('Components/Primitives/Alerts/ConfirmationDialog', () => {
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

    await waitFor(() => {
      expect(getByRole('alertdialog')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Confirm'));

    await waitFor(() => {
      expect(mockConfirmationHandler).toBeCalled();
    });
  });

  it('should open tooltip', async () => {
    // Act
    const { getByRole } = render({ tooltip: 'Tooltip' });

    // Assert
    expect(getByRole('button')).toBeInTheDocument();

    await userEvent.hover(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('tooltip')).toBeInTheDocument();
      expect(getByRole('tooltip')).toHaveTextContent('Tooltip');
    });
  });
});

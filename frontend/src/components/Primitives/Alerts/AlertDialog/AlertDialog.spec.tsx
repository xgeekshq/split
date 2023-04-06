import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogProps,
  AlertDialogTrigger,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const render = ({ children, ...props }: Partial<AlertDialogProps> = {}) =>
  renderWithProviders(
    <AlertDialog>
      {/* Button to Open the Dialog */}
      <AlertDialogTrigger asChild data-testid="alertDialogTrigger">
        <Button>Open Alert Dialog</Button>
      </AlertDialogTrigger>

      {/* Actual Dialog */}
      <AlertDialogContent
        title="Title"
        handleClose={jest.fn()}
        {...props}
        data-testid="alertDialog"
      >
        {children}
        <Flex justify="end" gap="16">
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction>Action</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>,
  );

describe('Components/Primitives/Alerts/AlertDialog', () => {
  it('should render the trigger correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('alertDialogTrigger')).toBeInTheDocument();
  });

  it('should open the alert dialog when trigger is clicked', async () => {
    // Act
    const { getByTestId } = render();
    fireEvent.click(getByTestId('alertDialogTrigger'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('alertDialog')).toBeInTheDocument();
    });
  });

  it('should render the title', async () => {
    // Act
    const { getByText, getByTestId } = render();
    fireEvent.click(getByTestId('alertDialogTrigger'));

    // Assert
    await waitFor(() => {
      expect(getByTestId('alertDialog')).toBeInTheDocument();
      expect(getByText('Title')).toBeInTheDocument();
    });
  });

  it('should close the dialog when the x is clicked', async () => {
    // Arrange
    const handleClose = jest.fn();

    // Act
    const { getByTestId } = render({ handleClose });
    fireEvent.click(getByTestId('alertDialogTrigger'));
    fireEvent.click(getByTestId('alertDialog').querySelector('svg')!);

    // Assert
    await waitFor(() => {
      expect(handleClose).toBeCalled();
    });
  });
});

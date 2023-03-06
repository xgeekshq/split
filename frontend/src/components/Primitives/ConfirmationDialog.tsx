import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from './AlertDialog';
import Flex from './Flex';

type ConfirmationDialogProps = {
  trigger: React.ReactNode;
  description: string;
  confirmationHandler: () => void;
  confirmationLabel: string;
  title?: string;
  variant?: 'primary' | 'danger';
};

const ConfirmationDialog = ({
  trigger,
  description,
  confirmationHandler,
  confirmationLabel,
  title,
  variant = 'primary',
}: ConfirmationDialogProps) => {
  const outlineVatiant = variant === 'primary' ? 'primaryOutline' : 'dangerOutline';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent title={title}>
        <Flex direction="column" css={{ mb: '$8' }}>
          {description}
        </Flex>
        <Flex justify="end" gap="16">
          <AlertDialogCancel variant={outlineVatiant}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={variant} onClick={confirmationHandler}>
            {confirmationLabel}
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

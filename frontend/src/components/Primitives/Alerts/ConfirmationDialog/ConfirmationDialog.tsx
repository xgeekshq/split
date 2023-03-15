import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '../AlertDialog/AlertDialog';
import Flex from '../../Layout/Flex/Flex';
import Tooltip from '../../Tooltips/Tooltip/Tooltip';

export type ConfirmationDialogProps = {
  description: string | React.ReactNode;
  confirmationHandler: () => void;
  confirmationLabel: string;
  title?: string;
  variant?: 'primary' | 'danger';
  tooltip?: string;
  children: React.ReactNode;
};

const ConfirmationDialog = ({
  description,
  confirmationHandler,
  confirmationLabel,
  title,
  variant = 'primary',
  tooltip,
  children,
}: ConfirmationDialogProps) => {
  const outlineVariant = variant === 'primary' ? 'primaryOutline' : 'dangerOutline';

  const renderTrigger = () => {
    if (tooltip !== undefined) {
      return (
        <Tooltip content={tooltip}>
          <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        </Tooltip>
      );
    }

    return <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>;
  };

  return (
    <AlertDialog>
      {renderTrigger()}
      <AlertDialogContent title={title}>
        <Flex direction="column" css={{ mb: '$8' }}>
          {description}
        </Flex>
        <Flex justify="end" gap="16">
          <AlertDialogCancel variant={outlineVariant}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={variant} onClick={confirmationHandler}>
            {confirmationLabel}
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

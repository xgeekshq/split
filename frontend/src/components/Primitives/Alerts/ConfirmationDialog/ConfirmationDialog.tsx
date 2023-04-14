import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';

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
        <Flex css={{ mb: '$8' }} direction="column">
          {description}
        </Flex>
        <Flex gap="16" justify="end">
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmationHandler} variant={variant}>
            {confirmationLabel}
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

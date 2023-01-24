import { ReactNode } from 'react';
import { CSS } from '@stitches/react/types/css-util';

import Icon from '@/components/icons/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '../AlertDialog';
import Flex from '../Flex';
import Separator from '../Separator';
import {
  DialogButtons,
  DialogText,
  DialogTitleContainer,
  StyledAlertDialogDescription,
  StyledDialogTitle,
} from './styles';

interface BoardAlertDialog {
  defaultOpen: boolean;
  text: ReactNode;
  cancelText: string;
  confirmText: string;
  handleConfirm?: () => void;
  title: ReactNode;
  handleClose?: () => void;
  children?: ReactNode;
  css?: CSS;
  variant?: 'primary' | 'danger';
  addEllipsis?: boolean;
}

const AlertCustomDialog = ({
  defaultOpen,
  text,
  handleClose,
  handleConfirm,
  title,
  cancelText,
  confirmText,
  children,
  css,
  addEllipsis,
  variant = 'primary',
}: BoardAlertDialog) => (
  <AlertDialog defaultOpen={defaultOpen}>
    {children}
    <AlertDialogContent css={{ ...css }} handleClose={handleClose}>
      <DialogTitleContainer align="center" justify="between">
        <StyledDialogTitle heading="4">{title}</StyledDialogTitle>
        <AlertDialogCancel
          asChild
          isIcon
          css={{ '@hover': { '&:hover': { cursor: 'pointer' } } }}
          onClick={handleClose}
        >
          <Flex css={{ '& svg': { color: '$primary400' } }}>
            <Icon css={{ width: '$24', height: '$24' }} name="close" />
          </Flex>
        </AlertDialogCancel>
      </DialogTitleContainer>
      <Separator css={{ backgroundColor: '$primary100' }} />
      <DialogText direction="column" ellipsis={addEllipsis}>
        <StyledAlertDialogDescription>{text}</StyledAlertDialogDescription>
      </DialogText>
      <DialogButtons gap="24" justify="end">
        <AlertDialogCancel variant="primaryOutline" onClick={handleClose}>
          {cancelText}
        </AlertDialogCancel>
        <AlertDialogAction variant={variant || 'danger'} onClick={handleConfirm}>
          {confirmText}
        </AlertDialogAction>
      </DialogButtons>
    </AlertDialogContent>
  </AlertDialog>
);

AlertCustomDialog.defaultProps = {
  handleClose: undefined,
  children: undefined,
  css: undefined,
  variant: 'primary',
  addEllipsis: false,
};

export default AlertCustomDialog;

import React from 'react';
import { Dialog as RadixDialog, Portal } from '@radix-ui/react-dialog';
import {
  StyledDialogContainer,
  StyledDialogContent,
  StyledDialogOverlay,
} from '@/components/Board/Settings/styles';
import DialogFooter from './DialogFooter';
import DialogHeader from './DialogHeader';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

const Dialog = (props: Props) => {
  const { isOpen, setIsOpen, children } = props;

  return (
    <StyledDialogContainer>
      <RadixDialog open={isOpen} onOpenChange={setIsOpen}>
        <Portal>
          <StyledDialogOverlay />
          <StyledDialogContent>{children}</StyledDialogContent>
        </Portal>
      </RadixDialog>
    </StyledDialogContainer>
  );
};

Dialog.Footer = DialogFooter;
Dialog.Header = DialogHeader;

export default Dialog;

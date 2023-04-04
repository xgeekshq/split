import React from 'react';
import { Dialog as RadixDialog, Portal } from '@radix-ui/react-dialog';
import {
  StyledDialogContent,
  StyledDialogOverlay,
} from '@/components/Primitives/Dialogs/Dialog/styles';
import DialogFooter from '@/components/Primitives/Dialogs/Dialog/DialogFooter';
import DialogHeader from '@/components/Primitives/Dialogs/Dialog/DialogHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type DialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

const Dialog = ({ isOpen, setIsOpen, children }: DialogProps) => (
  <RadixDialog open={isOpen} onOpenChange={setIsOpen}>
    <Portal>
      <StyledDialogOverlay />
      <StyledDialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <Flex direction="column" css={{ height: '100%' }}>
          {children}
        </Flex>
      </StyledDialogContent>
    </Portal>
  </RadixDialog>
);

Dialog.Footer = DialogFooter;
Dialog.Header = DialogHeader;

export default Dialog;

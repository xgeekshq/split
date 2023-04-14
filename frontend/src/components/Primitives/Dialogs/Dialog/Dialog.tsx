import React from 'react';
import { Dialog as RadixDialog, Portal } from '@radix-ui/react-dialog';

import DialogFooter from '@/components/Primitives/Dialogs/Dialog/DialogFooter';
import DialogHeader from '@/components/Primitives/Dialogs/Dialog/DialogHeader';
import {
  StyledDialogContent,
  StyledDialogOverlay,
} from '@/components/Primitives/Dialogs/Dialog/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type DialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

const Dialog = ({ isOpen, setIsOpen, children }: DialogProps) => (
  <RadixDialog onOpenChange={setIsOpen} open={isOpen}>
    <Portal>
      <StyledDialogOverlay />
      <StyledDialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <Flex css={{ height: '100%' }} direction="column">
          {children}
        </Flex>
      </StyledDialogContent>
    </Portal>
  </RadixDialog>
);

Dialog.Footer = DialogFooter;
Dialog.Header = DialogHeader;

export default Dialog;

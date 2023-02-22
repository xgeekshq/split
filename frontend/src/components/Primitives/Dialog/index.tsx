import React from 'react';
import { Dialog as RadixDialog, Portal } from '@radix-ui/react-dialog';
import { StyledDialogContent, StyledDialogOverlay } from './styles';
import DialogFooter from './DialogFooter';
import DialogHeader from './DialogHeader';
import Flex from '../Flex';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

const Dialog = ({ isOpen, setIsOpen, children }: Props) => (
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

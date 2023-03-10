import { ReactNode } from 'react';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { CSS, styled } from '@/styles/stitches/stitches.config';
import { overlayShow } from '@/animations/DialogShow';

import Button from '../../Button/Button';
import Flex from '../../Layout/Flex';
import Text from '../../Text';
import Icon from '../../Icon';
import Separator from '../../Separator';

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, {
  backdropFilter: 'blur(3px)',
  backgroundColor: 'rgba(80, 80, 89, 0.2)',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  zIndex: '256',
});

const StyledContent = styled(AlertDialogPrimitive.Content, {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  borderRadius: '$12',
  position: 'fixed',
  top: '20%',
  left: '50%',
  transform: 'translateX(-50%)',
  maxWidth: '500px',
  width: '90vw',
  zIndex: 2147483648,
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
  '&:focus': { outline: 'none' },
});

export const AlertDialogTrigger = styled(AlertDialogPrimitive.Trigger, {
  cursor: 'pointer',
});
export const AlertDialogAction = styled(AlertDialogPrimitive.Action, Button, {});
export const AlertDialogCancel = styled(AlertDialogPrimitive.Cancel, Button, {});

export type AlertDialogProps = {
  children?: ReactNode;
  css?: CSS;
  handleClose?: () => void;
  title?: string;
};

const Content = ({ children, css, handleClose, title, ...props }: AlertDialogProps) => (
  <AlertDialogPrimitive.Portal>
    <StyledOverlay />
    <StyledContent css={css} onCloseAutoFocus={handleClose} {...props}>
      {title && (
        <>
          <Flex align="center" justify="between" css={{ px: '$32', py: '$24' }}>
            <Text heading="4">{title}</Text>
            <AlertDialogCancel isIcon onClick={handleClose}>
              <Icon name="close" css={{ color: '$primary400' }} />
            </AlertDialogCancel>
          </Flex>
          <Separator />
        </>
      )}
      <Flex direction="column" gap="8" css={{ px: '$32', py: '$24' }}>
        {children}
      </Flex>
    </StyledContent>
  </AlertDialogPrimitive.Portal>
);

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogContent = Content;

import { ReactNode } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { CSS, styled } from '@/styles/stitches/stitches.config';

import { overlayShow } from '@/animations/DialogShow';
import Box from './Box';
import Button from './Button';
import Flex from './Flex';
import Text from './Text';
import Icon from '../icons/Icon';
import Separator from './Separator';

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, {
  backdropFilter: 'blur(3px)',
  backgroundColor: 'rgba(80, 80, 89, 0.2)',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  zIndex: '100',
});

const StyledContent = styled(AlertDialogPrimitive.Content, Flex, Box, {
  flexDirection: 'column !important',
  backgroundColor: 'white !important',
  borderRadius: '$12 !important',
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

const StyledTitleContainer = styled(Flex, { px: '$32', py: '$24' });
const StyledDescription = styled(Flex, {
  px: '$32',
  py: '$24',
  flexDirection: 'column !important',
  gap: '$8',
});

export const AlertDialogTrigger = styled(AlertDialogPrimitive.Trigger, {});
export const AlertDialogAction = styled(AlertDialogPrimitive.Action, Button, {});
export const AlertDialogCancel = styled(AlertDialogPrimitive.Cancel, Button, {});

type ContentProps = { children?: ReactNode; css?: CSS; handleClose?: () => void; title?: string };

const Content: React.FC<ContentProps> = ({ children, css, handleClose, title, ...props }) => {
  Content.defaultProps = {
    css: undefined,
    children: undefined,
    handleClose: undefined,
  };
  return (
    <AlertDialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent css={css} onCloseAutoFocus={handleClose} {...props}>
        {title && (
          <>
            <StyledTitleContainer align="center" justify="between">
              <Text heading="4">{title}</Text>
              <AlertDialogCancel isIcon onClick={handleClose}>
                <Icon name="close" css={{ color: '$primary400' }} />
              </AlertDialogCancel>
            </StyledTitleContainer>
            <Separator css={{ backgroundColor: '$primary100' }} />
          </>
        )}
        <StyledDescription>{children}</StyledDescription>
      </StyledContent>
    </AlertDialogPrimitive.Portal>
  );
};

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogContent = Content;

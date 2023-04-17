import * as DialogPrimitive from '@radix-ui/react-dialog';

import { keyframes, styled } from '@/styles/stitches/stitches.config';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translateX(100%)' },
  '100%': { opacity: 1, transform: 'translateX(0%)' },
});

const StyledDialogOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: 'rgba(0,0,0,0.75)',
  position: 'fixed',
  inset: 0,
  zIndex: 9,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

const StyledDialogContent = styled(DialogPrimitive.Content, {
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  width: '$592',
  padding: 0,
  backgroundColor: 'white',
  zIndex: 10,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
});

const StyledDialogTitle = styled('div', DialogPrimitive.Title, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$24 $32',
  borderBottom: '1px solid $colors$primary100',
});

export { StyledDialogContent, StyledDialogOverlay, StyledDialogTitle };

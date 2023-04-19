import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { useRecoilState } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';
import { toastState } from '@/store/toast/atom/toast.atom';
import { keyframes, styled } from '@/styles/stitches/stitches.config';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  top: '$106',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingRight: '$162',
  width: 'fit-content',
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
});

const StyledToast = styled(ToastPrimitive.Root, {
  backgroundColor: 'white',
  py: '$12',
  px: '$16',
  borderRadius: '$12',
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
  display: 'flex',
  height: '$56',
  width: '$362',
  justifyContent: 'space-between',
  alignItems: 'center',
  direction: 'raw',
});

const StyledDescription = styled(ToastPrimitive.Description, {
  display: 'flex',
  gap: '$8',
  margin: 0,
  alignItems: 'center',
});

const StyledClose = styled(ToastPrimitive.Close, Button, {});

// Exports
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = StyledViewport;

const Toast = () => {
  const [currentToastState, setToastState] = useRecoilState(toastState);
  const { open, type, content } = currentToastState;

  const router = useRouter();
  const VIEWPORT_PADDING = router.asPath === ROUTES.START_PAGE_ROUTE ? 162 : 56;

  const slideIn = keyframes({
    from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
    to: { transform: 'translateX(0)' },
  });

  const swipeOut = keyframes({
    from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
    to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  });

  useEffect(() => {
    setTimeout(() => {
      setToastState({ open: false, type: ToastStateEnum.SUCCESS, content: '' });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <StyledToast
      duration={7000}
      onOpenChange={(e) => setToastState({ open: e, type, content })}
      open={open}
      type="foreground"
      css={{
        '@media (prefers-reduced-motion: no-preference)': {
          '&[data-state="open"]': {
            animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
          },
          '&[data-state="closed"]': {
            animation: `${hide} 100ms ease-in forwards`,
          },
          '&[data-swipe="move"]': {
            transform: 'translateX(var(--radix-toast-swipe-move-x))',
          },
          '&[data-swipe="cancel"]': {
            transform: 'translateX(0)',
            transition: 'transform 200ms ease-out',
          },
          '&[data-swipe="end"]': {
            animation: `${swipeOut} 100ms ease-out forwards`,
          },
        },
      }}
    >
      <StyledDescription>
        {type === ToastStateEnum.ERROR && <Icon name="blob-error" size={32} />}
        {type === ToastStateEnum.SUCCESS && <Icon name="blob-success" size={32} />}
        {type === ToastStateEnum.WARNING && <Icon name="blob-warning" size={32} />}
        {type === ToastStateEnum.INFO && <Icon name="blob-info" size={32} />}
        <Text size="sm">{content}</Text>
      </StyledDescription>
      <StyledClose isIcon aria-label="Close" size="sm">
        <Icon css={{ color: '$primary800' }} name="close" size={16} />
      </StyledClose>
    </StyledToast>
  );
};

export default Toast;

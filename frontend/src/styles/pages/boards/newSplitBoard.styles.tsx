import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Flex';

const Container = styled('main', {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '$primary50',
});

const PageHeader = styled('header', {
  height: '$92',
  width: '100%',
  top: 0,
  zIndex: 3,
  borderBottom: '0.8px solid $primary200',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  padding: '$32 $40',

  backgroundColor: '$white',

  button: {
    '& svg': {
      size: '$40 !important',
      color: '$primary800',
    },

    transition: 'background-color 0.2s ease-in-out',

    '&:hover': {
      backgroundColor: '$primaryLightest',
    },
  },
});

const ContentWrapper = styled('section', {
  width: '100%',
  height: 'calc(100vh - $sizes$92 - $sizes$81)',
  overflowY: 'scroll',
});

const ContentContainer = styled('section', {
  display: 'flex',
  width: '100%',
  height: 'auto',
});

const InnerContent = styled(Flex, {
  flex: '1 1 auto',
  width: '100%',
  height: '100%',
});

const StyledForm = styled('form', Flex, {
  variants: {
    status: {
      false: {
        opacity: 0.5,
        pointerEvents: 'none',

        '&>div:first-child': {
          padding: '$20 92px 57px 152px',
        },
      },
      true: {
        '&>div:first-child': {
          padding: '64px 92px 57px 152px',
        },
      },
    },
  },

  defaultVariants: {
    status: true,
  },
  flex: '1 1 auto',
});

const SubContainer = styled('div', {
  width: 'calc(100vw - $sizes$384)', // remove space from tipbar
  minHeight: 'calc(100vh - $sizes$92 - $sizes$81)', // remove size of header
  marginRight: 'auto',
  display: 'flex',
  gap: '$20',
  flexDirection: 'column',
});

const ButtonsContainer = styled(Flex, {
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  borderTop: '0.8px solid $primary200',
  py: '$16',
  pr: '$32',

  backgroundColor: 'white',
});

export {
  ButtonsContainer,
  Container,
  ContentWrapper,
  ContentContainer,
  InnerContent,
  PageHeader,
  StyledForm,
  SubContainer,
};

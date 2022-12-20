import { styled } from '@/styles/stitches/stitches.config';

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

const ContentContainer = styled('section', {
  display: 'flex',
  width: '100%',
  minHeight: 'calc(100vh - $sizes$141)',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

export { Container, ContentContainer, PageHeader };

import { styled } from '@/styles/stitches/stitches.config';

const ScrollableContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  height: '100%',
  overflowY: 'auto',
  pr: '$8',
});

export default ScrollableContent;

import { styled } from '@/styles/stitches/stitches.config';

const TileContainer = styled('section', {
  display: 'grid',
  gap: '$29',
  gridTemplateColumns: 'repeat(3, 1fr)',
});

export { TileContainer };

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icon';

const GridContainer = styled('section', {
  display: 'grid',
  gap: '$29',
  gridTemplateColumns: 'repeat(3, 1fr)',
});

const StyledTile = styled('div', {
  position: 'relative',

  padding: '$20 $24',
  borderRadius: '$12',

  color: '$primary50',
  backgroundColor: '$primary800',

  h3: {
    margin: 0,

    color: 'white',
    fontSize: '$32',
    lineHeight: '$36',
    fontWeight: '$bold',
  },
  '@hover': {
    cursor: 'pointer',
  },
});

const TileArrow = styled(Icon, {
  position: 'absolute',
  bottom: '$28',
  right: '$28',

  color: '#000',
});

export { GridContainer, StyledTile, TileArrow };

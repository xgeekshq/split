import { styled } from '@/styles/stitches/stitches.config';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

const TileContainer = styled('section', {
  display: 'grid',
  gap: '$29',
  gridTemplateColumns: 'repeat(3, 1fr)',
});

const StyledTile = styled('div', {
  position: 'relative',
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
  right: '20px',
  top: '50%',
  bottom: '-1px',
  color: '$black',
});

const TileBlob = styled(Icon, {
  position: 'absolute',
  right: '-1px',
});

export { TileContainer, StyledTile, TileArrow, TileBlob };

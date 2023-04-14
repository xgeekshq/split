import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { styled } from '@/styles/stitches/stitches.config';

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
  right: '$20',
  top: '50%',
  bottom: '$-1',
  color: '$black',
});

const TileBlob = styled(Icon, {
  position: 'absolute',
  right: '$-1',
});

export { StyledTile, TileArrow, TileBlob };

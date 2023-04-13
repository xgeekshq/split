import { styled } from '@/styles/stitches/stitches.config';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const StyledTile = styled(Flex, {
  position: 'relative',
  borderRadius: '$12',
  color: '$primary50',
  backgroundColor: '$primary800',
  overflow: 'hidden',

  py: '$20',
  px: '$24',

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
  color: '$black',
  position: 'relative', // Force it to be above TileBlob
  alignSelf: 'flex-end',
});

const TileBlob = styled(Icon, {
  position: 'absolute',
  right: '$-1',

  width: '100px !important',
  height: '100px !important',
  top: '0',

  variants: {
    color: {
      yellow: {
        width: '127px !important',
        height: '76px !important',
        bottom: '0',
        top: 'unset',
      },
      purple: {},
      blue: {},
    },
  },
});

const TileTextContainer = styled(Flex, {
  position: 'relative', // Force it to be above TileBlob
  textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', // Text borders so that it can be visible when above the TileBlob
});

export { StyledTile, TileArrow, TileBlob, TileTextContainer };

import Link from 'next/link';

import {
  StyledTile,
  TileArrow,
  TileBlob,
  TileTextContainer,
} from '@/components/Dashboard/Tiles/Tile/styles';
import Text from '@/components/Primitives/Text/Text';

export type TileProps = {
  link: string;
  title: string;
  count: number;
  color: 'purple' | 'blue' | 'yellow';
};

const Tile = ({ link, title, count, color }: TileProps) => (
  <Link href={link}>
    <StyledTile align="center" data-testid="tile" justify="between">
      <TileBlob color={color} name={`blob-${color}`} />
      <TileTextContainer direction="column">
        <Text color="white" css={{ whiteSpace: 'nowrap' }} size="md">
          {title}
        </Text>
        <h3>{count}</h3>
      </TileTextContainer>
      <TileArrow name="arrow-long-right" />
    </StyledTile>
  </Link>
);

export default Tile;

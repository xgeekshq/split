import Text from '@/components/Primitives/Text/Text';
import Link from 'next/link';
import {
  StyledTile,
  TileArrow,
  TileBlob,
  TileTextContainer,
} from '@/components/Dashboard/Tiles/Tile/styles';

export type TileProps = {
  link: string;
  title: string;
  count: number;
  color: 'purple' | 'blue' | 'yellow';
};

const Tile = ({ link, title, count, color }: TileProps) => (
  <Link href={link}>
    <StyledTile data-testid="tile" justify="between" align="center">
      <TileBlob name={`blob-${color}`} color={color} />
      <TileTextContainer direction="column">
        <Text color="white" size="md" css={{ whiteSpace: 'nowrap' }}>
          {title}
        </Text>
        <h3>{count}</h3>
      </TileTextContainer>

      <TileArrow name="arrow-long-right" />
    </StyledTile>
  </Link>
);

export default Tile;

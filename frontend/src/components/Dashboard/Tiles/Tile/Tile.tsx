import Link from 'next/link';

import { StyledTile, TileArrow, TileBlob } from '@/components/Dashboard/Tiles/Tile/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

export type TileProps = {
  link: string;
  title: string;
  count: number;
  color: 'purple' | 'blue' | 'yellow';
};

const Tile = ({ link, title, count, color }: TileProps) => {
  const styles =
    color === 'yellow'
      ? {
          width: '127px',
          height: '76px',
          bottom: '-1px',
        }
      : {
          width: '100px',
          height: '100px',
          top: '0',
        };

  return (
    <Link href={link}>
      <StyledTile data-testid="tile">
        <Flex css={{ width: '80%', py: '$20', px: '$24' }} direction="column">
          <Text color="white" size="md">
            {title}
          </Text>
          <h3>{count}</h3>
        </Flex>

        <TileBlob css={styles} name={`blob-${color}`} />
        <TileArrow name="arrow-long-right" />
      </StyledTile>
    </Link>
  );
};

export default Tile;

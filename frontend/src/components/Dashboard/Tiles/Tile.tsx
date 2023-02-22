import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Link from 'next/link';
import { StyledTile, TileArrow, TileBlob } from './styles';

type TileProps = {
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
      <StyledTile>
        <Flex direction="column" css={{ width: '80%', py: '$20', px: '$24' }}>
          <Text color="white" size="md">
            {title}
          </Text>
          <h3>{count}</h3>
        </Flex>

        <TileBlob name={`blob-${color}`} css={styles} />
        <TileArrow name="arrow-long-right" />
      </StyledTile>
    </Link>
  );
};

export default Tile;

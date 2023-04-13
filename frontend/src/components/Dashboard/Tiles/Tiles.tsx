import { HeaderInfo } from '@/types/dashboard/header.info';
import { BOARDS_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/utils/routes';
import Tile from '@/components/Dashboard/Tiles/Tile/Tile';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type TilesProps = {
  data: HeaderInfo;
};

const Tiles = ({ data }: TilesProps) => (
  <Flex as="section" gap="26" wrap="wrap" css={{ '> *': { flex: 1 } }}>
    <Tile link={BOARDS_ROUTE} title="Your boards" count={data.boardsCount} color="purple" />
    <Tile link={TEAMS_ROUTE} title="Your teams" count={data.teamsCount} color="blue" />
    <Tile link={USERS_ROUTE} title="Active Members" count={data.usersCount} color="yellow" />
  </Flex>
);

export default Tiles;

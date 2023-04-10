import { HeaderInfo } from '@/types/dashboard/header.info';
import { BOARDS_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/utils/routes';
import { TileContainer } from '@/components/Dashboard/Tiles/styles';
import Tile from '@/components/Dashboard/Tiles/Tile/Tile';

export type TilesProps = {
  data: HeaderInfo;
};

const Tiles = ({ data }: TilesProps) => (
  <TileContainer>
    <Tile link={BOARDS_ROUTE} title="Your boards" count={data.boardsCount} color="purple" />
    <Tile link={TEAMS_ROUTE} title="Your teams" count={data.teamsCount} color="blue" />
    <Tile link={USERS_ROUTE} title="Active Members" count={data.usersCount} color="yellow" />
  </TileContainer>
);

export default Tiles;

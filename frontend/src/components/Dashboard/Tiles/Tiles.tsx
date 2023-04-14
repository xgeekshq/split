import { TileContainer } from '@/components/Dashboard/Tiles/styles';
import Tile from '@/components/Dashboard/Tiles/Tile/Tile';
import { HeaderInfo } from '@/types/dashboard/header.info';
import { BOARDS_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/utils/routes';

export type TilesProps = {
  data: HeaderInfo;
};

const Tiles = ({ data }: TilesProps) => (
  <TileContainer>
    <Tile color="purple" count={data.boardsCount} link={BOARDS_ROUTE} title="Your boards" />
    <Tile color="blue" count={data.teamsCount} link={TEAMS_ROUTE} title="Your teams" />
    <Tile color="yellow" count={data.usersCount} link={USERS_ROUTE} title="Active Members" />
  </TileContainer>
);

export default Tiles;

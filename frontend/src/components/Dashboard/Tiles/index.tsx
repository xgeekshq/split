import { HeaderInfo } from '@/types/dashboard/header.info';
import { BOARDS_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/utils/routes';
import { GridContainer } from './styles';
import Tile from './Tile';

type TilesProps = {
  data: HeaderInfo;
};

const DashboardTiles = ({ data }: TilesProps) => (
  <GridContainer>
    <Tile link={BOARDS_ROUTE} title="Your boards" count={data.boardsCount} color="purple" />
    <Tile link={TEAMS_ROUTE} title="Your teams" count={data.teamsCount} color="blue" />
    <Tile link={USERS_ROUTE} title="Active Members" count={data.usersCount} color="yellow" />
  </GridContainer>
);

export default DashboardTiles;

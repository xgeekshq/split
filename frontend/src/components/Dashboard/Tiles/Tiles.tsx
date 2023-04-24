import React from 'react';

import Tile from '@/components/Dashboard/Tiles/Tile/Tile';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { BOARDS_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/constants/routes';
import { HeaderInfo } from '@/types/dashboard/header.info';

export type TilesProps = {
  data: HeaderInfo;
};

const Tiles = ({ data }: TilesProps) => (
  <Flex as="section" css={{ '> *': { flex: 1 } }} gap="26" wrap="wrap">
    <Tile color="purple" count={data.boardsCount} link={BOARDS_ROUTE} title="Your boards" />
    <Tile color="blue" count={data.teamsCount} link={TEAMS_ROUTE} title="Your teams" />
    <Tile color="yellow" count={data.usersCount} link={USERS_ROUTE} title="Active Members" />
  </Flex>
);

export default Tiles;

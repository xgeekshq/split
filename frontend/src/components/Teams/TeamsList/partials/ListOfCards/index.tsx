import React from 'react';

import { DotsLoading } from '@/components/loadings/DotsLoading';
import Flex from '@/components/Primitives/Flex';
import { Team } from '@/types/team/team';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import CardBody from '../CardTeam/CardBody';

type ListOfCardsProp = {
  teams: Team[];
  userId: string;
  isLoading: boolean;
};

const ListOfCards = React.memo<ListOfCardsProp>(({ teams, userId, isLoading }) => (
  <ScrollableContent
    direction="column"
    gap="24"
    justify="start"
    css={{ height: 'calc(100vh - 190px)', paddingBottom: '$8' }}
  >
    <Flex direction="column" gap="8">
      {teams.map((team: Team) => (
        <CardBody key={team._id} team={team} userId={userId} isTeamPage />
      ))}
    </Flex>

    {isLoading && (
      <Flex justify="center">
        <DotsLoading />
      </Flex>
    )}
  </ScrollableContent>
));

export default ListOfCards;

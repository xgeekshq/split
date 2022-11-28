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
  <ScrollableContent direction="column" gap="24" justify="start">
    <Flex direction="column" gap="20">
      {teams.map((team: Team) => (
        <CardBody key={team._id} team={team} userId={userId} />
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

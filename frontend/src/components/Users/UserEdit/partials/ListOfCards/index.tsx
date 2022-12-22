import React from 'react';
import Flex from '@/components/Primitives/Flex';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { Team } from '@/types/team/team';
import { DotsLoading } from '@/components/loadings/DotsLoading';

type ListOfCardsProp = {
  userId: string | undefined;
  teams: Team[];
  isLoading: boolean;
};

const ListOfCards = React.memo<ListOfCardsProp>(({ userId, teams, isLoading }) => (
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

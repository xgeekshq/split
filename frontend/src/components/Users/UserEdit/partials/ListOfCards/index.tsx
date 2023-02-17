import React from 'react';
import Flex from '@/components/Primitives/Flex';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { Team } from '@/types/team/team';
import Dots from '@/components/Primitives/Loading/Dots';
import { useRecoilValue } from 'recoil';
import { userTeamsListState } from '@/store/team/atom/team.atom';

type ListOfCardsProp = {
  userId: string | undefined;
  isLoading: boolean;
};

const ListOfCards = React.memo<ListOfCardsProp>(({ userId, isLoading }) => {
  const teamsOfUsers = useRecoilValue(userTeamsListState);

  return (
    <ScrollableContent direction="column" gap="24" justify="start">
      <Flex direction="column" gap="8">
        {teamsOfUsers?.map((team: Team) => (
          <CardBody key={team.id} team={team} userId={userId} isTeamPage={false} teamId={team.id} />
        ))}
      </Flex>
      {isLoading && (
        <Flex justify="center">
          <Dots />
        </Flex>
      )}
    </ScrollableContent>
  );
});

export default ListOfCards;

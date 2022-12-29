import React from 'react';
import Flex from '@/components/Primitives/Flex';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { Team } from '@/types/team/team';
import { DotsLoading } from '@/components/loadings/DotsLoading';
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
      <Flex direction="column" gap="20">
        {teamsOfUsers?.map((team: Team) => (
          <CardBody
            key={team._id}
            team={team}
            userId={userId}
            isTeamPage={false}
            teamId={team._id}
          />
        ))}
      </Flex>
      {isLoading && (
        <Flex justify="center">
          <DotsLoading />
        </Flex>
      )}
    </ScrollableContent>
  );
});

export default ListOfCards;

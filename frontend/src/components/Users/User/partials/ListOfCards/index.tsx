import React from 'react';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import TeamItem from '@/components/Teams/TeamsList/TeamItem/TeamItem';
import { Team } from '@/types/team/team';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import { useRecoilValue } from 'recoil';
import { userTeamsListState } from '@/store/team/atom/team.atom';

type ListOfCardsProp = {
  isLoading: boolean;
};

const ListOfCards = React.memo<ListOfCardsProp>(({ isLoading }) => {
  const teamsOfUsers = useRecoilValue(userTeamsListState);

  return (
    <ScrollableContent direction="column" gap="24" justify="start">
      <Flex direction="column" gap="8">
        {teamsOfUsers?.map((team: Team) => (
          <TeamItem key={team.id} team={team} />
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

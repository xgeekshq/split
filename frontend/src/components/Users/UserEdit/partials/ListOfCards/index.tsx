import React from 'react';
import Flex from '@/components/Primitives/Flex';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { Team } from '@/types/team/team';
import { TeamUser } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

type ListOfCardsProp = {
  userId: string | undefined;
};

const users: TeamUser = {
  user: {
    _id: '1',
    firstName: 'zeca',
    lastName: 'pola',
    email: 'zeca@twe.pt',
    isSAdmin: true,
    joinedAt: '2022-11-17T12:51:21.897+00:00',
  },
  role: TeamUserRoles.ADMIN,
  isNewJoiner: false,
};

const ListOfCards = React.memo<ListOfCardsProp>(({ userId }) => {
  const dummyData: Team[] = [
    {
      _id: '1',
      name: 'xgeeks',
      users: [users],
    },
    {
      _id: '2',
      name: 'xkigroup',
      users: [users],
    },
  ];

  return (
    <ScrollableContent direction="column" gap="24" justify="start">
      <Flex direction="column" gap="20">
        {dummyData.map((team) => (
          <CardBody key={team._id} team={team} userId={userId} />
        ))}
      </Flex>
    </ScrollableContent>
  );
});

export default ListOfCards;

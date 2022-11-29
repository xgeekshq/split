import React from 'react';

import { DotsLoading } from '@/components/loadings/DotsLoading';
import Flex from '@/components/Primitives/Flex';
import { UserWithTeams } from '@/types/user/user';
import Text from '@/components/Primitives/Text';
import SearchInput from '@/components/Teams/CreateTeam/ListMembers/SearchInput';
import { ScrollableContent } from '../../../../Boards/MyBoards/styles';
import CardBody from '../CardUser/CardBody';

type ListOfCardsProp = {
  usersWithTeams: UserWithTeams[];
  isLoading: boolean;
};

const ListOfCards = React.memo<ListOfCardsProp>(({ usersWithTeams, isLoading }) => (
  <>
    <Flex>
      <Text css={{ fontWeight: '$bold', flex: 1, mt: '$36' }}>
        {usersWithTeams.length} registered users
      </Text>
      <Flex css={{ width: '460px' }} direction="column" gap={16}>
        <SearchInput icon="search" iconPosition="left" id="search" placeholder="Search user" />
      </Flex>
    </Flex>
    <ScrollableContent direction="column" gap="24" justify="start" css={{ mt: '-1px' }}>
      <Flex direction="column">
        {usersWithTeams.map((user: UserWithTeams) => (
          <CardBody key={user.user._id} user={user} />
        ))}
      </Flex>

      {isLoading && (
        <Flex justify="center">
          <DotsLoading />
        </Flex>
      )}
    </ScrollableContent>
  </>
));

export default ListOfCards;

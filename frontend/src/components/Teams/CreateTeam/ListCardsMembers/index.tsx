import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import CardMember from '../CardMember';
import { ListMembers } from '../ListMembers';
import { ScrollableContent } from './styles';

const TeamMembersList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession({ required: true });
  const membersList = useRecoilValue(membersListState);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Flex css={{ mt: '$38' }} direction="column">
      <Flex>
        <Text css={{ mb: '$16' }} heading="3">
          Team Members
        </Text>
        <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
      <ScrollableContent direction="column" justify="start" ref={scrollRef}>
        {membersList?.map((member) => (
          <CardMember
            key={member.user._id}
            isNewTeamPage
            isTeamCreator={member.user._id === session?.user.id}
            member={member}
          />
        ))}
      </ScrollableContent>
    </Flex>
  );
};

export default TeamMembersList;

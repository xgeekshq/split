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
  // const [containerHeight, setContainerHeight] = useState<number | null | undefined>(null);

  const { data: session } = useSession({ required: true });
  const membersList = useRecoilValue(membersListState);

  const scrollRef = useRef<HTMLDivElement>(null);

  // const handleScroll = () => {
  //   setContainerHeight(scrollRef.current?.scrollHeight);
  // };

  return (
    <Flex css={{ mt: '$38' }} direction="column">
      <Flex>
        <Text css={{ mb: '$16' }} heading="3">
          Team Members
        </Text>
        {/* {containerHeight && containerHeight > window.innerHeight - 500 ? ( */}
        <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
        {/* ) : null} */}
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
        {/* <ButtonAddMember onClick={() => setIsOpen(true)} css={{ marginLeft: 'auto' }}>
          <Icon css={{ width: '$16', height: '$16' }} name="plus" />
          <Text
            weight="medium"
            css={{
              ml: '$10',
              fontSize: '$14',
              lineHeight: '$18',
            }}
          >
            Add/remove members
          </Text>
        </ButtonAddMember> */}
      </ScrollableContent>
    </Flex>
  );
};

export default TeamMembersList;

import React, { MouseEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import Icon from '@/components/icons/Icon';
import CardMember from '../CardMember';
import { ListMembers } from '../ListMembers';
import { ScrollableContent } from './styles';
import { ButtonAddMember } from '../ListMembersDialog/styles';

const TeamMembersList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession({ required: true });
  const membersList = useRecoilValue(membersListState);

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <Flex css={{ mt: '$20' }} direction="column">
      <Flex>
        <Text css={{ flex: 1 }} heading="3">
          Team Members
        </Text>
        <ButtonAddMember onClick={handleOpen}>
          <Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
          <Text
            fontWeight="medium"
            css={{
              ml: '$10',
              fontSize: '$14',
              lineHeight: '$18',
            }}
          >
            Add/remove members
          </Text>
        </ButtonAddMember>
      </Flex>
      <ScrollableContent direction="column" justify="start">
        {membersList?.map((member) => (
          <CardMember
            key={member.user._id}
            isNewTeamPage
            isTeamCreator={member.user._id === session?.user.id}
            member={member}
          />
        ))}
      </ScrollableContent>
      <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
};

export default TeamMembersList;

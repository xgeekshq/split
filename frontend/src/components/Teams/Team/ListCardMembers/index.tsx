import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import CardMember from '@/components/Teams/CreateTeam/CardMember';
import { ButtonAddMember } from '@/components/Primitives/Dialog/styles';
import Icon from '@/components/icons/Icon';
import { ListMembers } from '../../CreateTeam/ListMembers';
import { ScrollableContent } from './styles';

type TeamMemberListProps = {
  handleMembersList: () => void;
};

const TeamMembersList = ({ handleMembersList }: TeamMemberListProps) => {
  const { data: session } = useSession({ required: true });
  const membersList = useRecoilValue(membersListState);

  const isSAdmin = session?.user.isSAdmin;

  const [isOpen, setIsOpen] = useState(false);
  const didMountRef = useRef(false);

  const user = membersList.find((member) => member.user._id === session?.user.id);

  useEffect(() => {
    if (didMountRef.current && !isOpen) {
      handleMembersList();
    }
    didMountRef.current = true;
  }, [handleMembersList, isOpen]);

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const userRole = user?.role;
  const isTeamMember = userRole === TeamUserRoles.MEMBER;

  if (!user && !isSAdmin) return null;
  return (
    <Flex css={{ mt: '$32' }} direction="column">
      <Flex css={{ mb: '$16' }}>
        <Text css={{ flex: 1 }} heading="3">
          Team Members
        </Text>
        <ButtonAddMember onClick={handleOpen}>
          <Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
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
        </ButtonAddMember>
        {(!isTeamMember || isSAdmin) && (
          <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} isTeamPage />
        )}
      </Flex>
      <ScrollableContent direction="column" justify="start">
        {membersList?.map((member) => (
          <CardMember
            key={member.user._id}
            isTeamPage
            isTeamCreator={member.user._id === session?.user.id}
            member={member}
            isTeamMember={isTeamMember}
            isOpen={isOpen}
          />
        ))}
      </ScrollableContent>
    </Flex>
  );
};

export default TeamMembersList;

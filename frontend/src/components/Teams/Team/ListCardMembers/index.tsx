import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import CardMember from '@/components/Teams/CreateTeam/CardMember';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
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

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  useEffect(() => {
    if (didMountRef.current && !isOpen) {
      handleMembersList();
    }
    didMountRef.current = true;
  }, [handleMembersList, isOpen]);

  const userRole = user?.role;
  const isTeamMember = userRole === TeamUserRoles.MEMBER;

  if (!user && !isSAdmin) return null;
  return (
    <Flex css={{ mt: '$32' }} direction="column">
      <Flex css={{ mb: '$16' }}>
        <Text css={{ flex: 1 }} heading="3">
          Team Members
        </Text>
        {(!isTeamMember || isSAdmin) && (
          <Button variant="link" size="sm" onClick={handleOpen}>
            <Icon name="plus" />
            Add/remove members
          </Button>
        )}
      </Flex>
      <ScrollableContent
        direction="column"
        justify="start"
        css={{ height: 'calc(100vh - 225px)', paddingBottom: '$8' }}
        gap="8"
      >
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
      <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} isTeamPage />
    </Flex>
  );
};

export default TeamMembersList;

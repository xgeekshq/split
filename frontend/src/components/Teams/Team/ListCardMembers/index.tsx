import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import CardMember from '@/components/Teams/CreateTeam/CardMember';
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const user = membersList.find((member) => member.user._id === session?.user.id);

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
      <Flex>
        <Text css={{ mb: '$16' }} heading="3">
          Team Members
        </Text>
        {(!isTeamMember || isSAdmin) && (
          <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} isTeamPage />
        )}
      </Flex>
      <ScrollableContent direction="column" justify="start" ref={scrollRef}>
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

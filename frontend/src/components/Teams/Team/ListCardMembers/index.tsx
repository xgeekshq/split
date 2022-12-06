import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import CardMember from '@/components/Teams/CreateTeam/CardMember';
import { ListMembers } from '../../CreateTeam/ListMembers';
import { ScrollableContent } from './styles';

const TeamMembersList = () => {
  const { data: session } = useSession({ required: true });
  const membersList = useRecoilValue(membersListState);

  const isSAdmin = session?.user.isSAdmin;

  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const user = membersList.find((member) => member.user._id === session?.user.id);

  if (!user) return null;

  const userRole = user.role;
  const isTeamMember = userRole === TeamUserRoles.MEMBER;
  return (
    <Flex css={{ mt: '$32' }} direction="column">
      <Flex>
        <Text css={{ mb: '$16' }} heading="3">
          Team Members
        </Text>
        {(!isTeamMember || isSAdmin) && <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />}
      </Flex>
      <ScrollableContent direction="column" justify="start" ref={scrollRef}>
        {membersList?.map((member) => (
          <CardMember
            key={member.user._id}
            isTeamPage
            isTeamCreator={member.user._id === session?.user.id}
            member={member}
            isTeamMember={isTeamMember}
          />
        ))}
      </ScrollableContent>
    </Flex>
  );
};

export default TeamMembersList;

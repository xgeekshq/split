import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Flex';
import { membersListState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import CardMember from '@/components/Teams/CreateTeam/CardMember';
import { ScrollableContent } from './styles';

const TeamMembersList = () => {
  const { data: session } = useSession({ required: true });
  const membersList = useRecoilValue(membersListState);

  const scrollRef = useRef<HTMLDivElement>(null);

  const user = membersList.find((member) => member.user._id === session?.user.id);

  let userRole: TeamUserRoles;

  if (user) userRole = user.role;

  return (
    <Flex css={{ mt: '$32' }} direction="column">
      <ScrollableContent direction="column" justify="start" ref={scrollRef}>
        {membersList?.map((member) => (
          <CardMember
            key={member.user._id}
            isTeamPage
            isTeamCreator={member.user._id === session?.user.id}
            member={member}
            isTeamMember={userRole === TeamUserRoles.MEMBER}
          />
        ))}
      </ScrollableContent>
    </Flex>
  );
};

export default TeamMembersList;

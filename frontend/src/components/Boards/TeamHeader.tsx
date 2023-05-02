import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { BoardUser } from '@/types/board/board.user';
import { Team } from '@/types/team/team';
import { TeamUser } from '@/types/team/team.user';

interface TeamHeaderProps {
  team?: Team;
  userId: string;
  users?: BoardUser[] | TeamUser[];
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team, userId, users }) => {
  const hasTeam = !!team;
  return (
    <Flex align="center" css={{ mb: '$16' }} gap="24" wrap="wrap">
      <Text
        heading="5"
        css={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          maxWidth: '$260',
        }}
      >
        {hasTeam ? team.name : 'My boards'}
      </Text>
      {hasTeam && (
        <Flex align="center" gap="12" wrap="wrap">
          <Flex align="center" gap="8">
            <Text color="primary300" size="sm">
              Members
            </Text>
            <AvatarGroup listUsers={team.users} userId={userId} />
          </Flex>
          <Separator orientation="vertical" size="md" />
          <Flex align="center" gap="8">
            <Text color="primary300" size="sm">
              Team admin
            </Text>
            <AvatarGroup stakeholders teamAdmins listUsers={team.users} userId={userId} />
          </Flex>
        </Flex>
      )}
      {!hasTeam && users && (
        <Flex>
          <AvatarGroup myBoards listUsers={users} userId={userId} />
        </Flex>
      )}
    </Flex>
  );
};

export default TeamHeader;

import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { BoardUser } from '@/types/board/board.user';
import { Team } from '@/types/team/team';
import { TeamUser } from '@/types/team/team.user';
import CardAvatars from '../CardBoard/CardAvatars';

interface TeamHeaderProps {
  team?: Team;
  userId: string;
  users?: BoardUser[] | TeamUser[];
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team, userId, users }) => {
  const hasTeam = !!team;
  return (
    <Flex align="center" css={{ mb: '$16' }} justify="between">
      <Flex align="center">
        <Text
          css={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: '$260',
          }}
          heading="5"
        >
          {hasTeam ? team.name : 'My boards'}
        </Text>
        {hasTeam && (
          <Flex align="center" css={{ ml: '$24' }} gap="12">
            <Flex align="center" gap="8">
              <Text color="primary300" size="sm">
                Members
              </Text>
              <CardAvatars
                listUsers={team.users}
                responsible={false}
                teamAdmins={false}
                userId={userId}
              />
            </Flex>
            <Separator
              css={{ backgroundColor: '$primary300', height: '$12 !important' }}
              orientation="vertical"
            />
            <Text color="primary300" size="sm">
              Team admin
            </Text>
            <CardAvatars teamAdmins listUsers={team.users} responsible={false} userId={userId} />
          </Flex>
        )}
        {!hasTeam && users && (
          <Flex css={{ ml: '$12' }}>
            <CardAvatars
              myBoards
              listUsers={users}
              responsible={false}
              teamAdmins={false}
              userId={userId}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default TeamHeader;

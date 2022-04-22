import { BoardUser } from "../../types/board/board.user";
import { Team } from "../../types/team/team";
import CardAvatars from "../CardBoard/CardAvatars";
import Flex from "../Primitives/Flex";
import Separator from "../Primitives/Separator";
import Text from "../Primitives/Text";

interface TeamHeaderProps {
  team?: Team;
  userId: string;
  users?: BoardUser[];
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ team, userId, users }) => {
  const hasTeam = !!team;
  return (
    <Flex align="center" css={{ mb: "$16" }} justify="between">
      <Flex align="center">
        <Text heading="5">{hasTeam ? team.name : "My boards"}</Text>
        {hasTeam && (
          <Flex align="center" css={{ ml: "$24" }} gap="12">
            <Flex gap="8" align="center">
              <Text size="sm" color="primary300">
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
              orientation="vertical"
              css={{ backgroundColor: "$primary300", height: "$12 !important" }}
            />
            <Text size="sm" color="primary300">
              Team admin
            </Text>
            <CardAvatars listUsers={team.users} responsible={false} teamAdmins userId={userId} />
          </Flex>
        )}
        {!hasTeam && users && (
          <Flex css={{ ml: "$12" }}>
            <CardAvatars
              listUsers={users}
              responsible={false}
              teamAdmins={false}
              userId={userId}
              myBoards
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default TeamHeader;

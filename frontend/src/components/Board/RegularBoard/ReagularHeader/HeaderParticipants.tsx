import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Layout/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';

interface Props {
  isParticipantsPage?: boolean;
}

const HeaderParticipants = ({ isParticipantsPage }: Props) => {
  const { data: session } = useSession();

  // Atoms
  const boardData = useRecoilValue(boardInfoState);

  // Get Board Users
  const { users } = boardData.board;

  return (
    <Flex gap="24">
      <Flex align="center" gap="10">
        {isParticipantsPage ? (
          <Text size="sm">Participants</Text>
        ) : (
          <StyledBoardTitle>
            <Text size="sm">Participants</Text>
          </StyledBoardTitle>
        )}
        <AvatarGroup
          responsible={false}
          listUsers={users}
          teamAdmins={false}
          userId={session?.user.id}
          isClickable
        />
      </Flex>
      <Flex align="center">
        <Separator orientation="vertical" size="lg" />
      </Flex>
      <Flex align="center" gap="10">
        <Text color="primary300" size="sm">
          Responsibles
        </Text>
        <AvatarGroup
          responsible
          listUsers={users}
          teamAdmins={false}
          userId={session?.user.id}
          isClickable
        />
      </Flex>
    </Flex>
  );
};

export default HeaderParticipants;

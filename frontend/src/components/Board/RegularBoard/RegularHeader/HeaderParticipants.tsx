import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { boardInfoState } from '@/store/board/atoms/board.atom';

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
        <AvatarGroup isClickable listUsers={users} userId={session?.user.id} />
      </Flex>
      <Flex align="center">
        <Separator orientation="vertical" size="lg" />
      </Flex>
      <Flex align="center" gap="10">
        <Text color="primary300" size="sm">
          Responsibles
        </Text>
        <AvatarGroup isClickable responsible listUsers={users} userId={session?.user.id} />
      </Flex>
    </Flex>
  );
};

export default HeaderParticipants;

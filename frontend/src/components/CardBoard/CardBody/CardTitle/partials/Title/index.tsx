import Link from 'next/link';

import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';

type Props = {
  userIsParticipating: boolean;
  boardId: string;
  title: string;
  isSubBoard: boolean | undefined;
  mainBoardId?: string;
};

const Title = ({
  userIsParticipating,
  boardId,
  title,
  isSubBoard,
  mainBoardId = undefined,
}: Props) =>
  userIsParticipating ? (
    <Link
      key={boardId}
      href={{
        pathname: `boards/[boardId]`,
        query: isSubBoard ? { boardId, mainBoardId } : { boardId },
      }}
    >
      <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
    </Link>
  ) : (
    <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
  );

export { Title };

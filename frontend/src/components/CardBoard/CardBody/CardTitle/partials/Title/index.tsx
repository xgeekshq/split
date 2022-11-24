import Link from 'next/link';

import { StyledBoardTitle } from './styles';

type Props = {
  userIsParticipating: boolean;
  boardId: string;
  title: string;
  isSubBoard: boolean | undefined;
  mainBoardId?: string;
};

const Title = ({ userIsParticipating, boardId, title, isSubBoard, mainBoardId }: Props) =>
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

Title.defaultProps = {
  mainBoardId: undefined,
};

export { Title };

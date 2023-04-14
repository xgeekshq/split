import { useCallback } from 'react';
import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { styled } from '@/styles/stitches/stitches.config';

type CardTitleProps = {
  userIsParticipating: boolean;
  boardId: string;
  title: string;
  isSubBoard: boolean | undefined;
  mainBoardId?: string;
  havePermissions: boolean;
  mainBoardTitle?: string;
};

const StyledBoardTitle = styled(Text, {
  fontWeight: '$bold',
  fontSize: '$14',
  letterSpacing: '$0-17',
  '&[data-disabled="true"]': { opacity: 0.4 },
  '@hover': {
    '&:hover': {
      '&[data-disabled="true"]': {
        textDecoration: 'none',
        cursor: 'default',
      },
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
});

const CardTitle: React.FC<CardTitleProps> = ({
  userIsParticipating,
  havePermissions,
  boardId,
  title,
  isSubBoard,
  mainBoardId,
  mainBoardTitle,
}) => {
  const getTitle = useCallback(() => {
    if (userIsParticipating || havePermissions) {
      return (
        <Link
          key={boardId}
          href={{
            pathname: `boards/[boardId]`,
            query: { boardId },
          }}
        >
          <StyledBoardTitle data-disabled={!userIsParticipating && !havePermissions}>
            {title}
          </StyledBoardTitle>
        </Link>
      );
    }

    return (
      <StyledBoardTitle data-disabled={!userIsParticipating && !havePermissions}>
        {title}
      </StyledBoardTitle>
    );
  }, [
    boardId,
    havePermissions,
    isSubBoard,
    mainBoardId,
    mainBoardTitle,
    title,
    userIsParticipating,
  ]);

  if (isSubBoard) {
    return (
      <Tooltip content="It’s a sub-team board. A huge team got split into sub teams.">
        {getTitle()}
      </Tooltip>
    );
  }
  return getTitle();
};

CardTitle.defaultProps = {
  mainBoardId: undefined,
};

export default CardTitle;

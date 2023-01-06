import Link from 'next/link';

import { styled } from '@/styles/stitches/stitches.config';

import Text from '@/components/Primitives/Text';

type CardTitleProps = {
  title: string;
  teamId: string;
  isTeamPage?: boolean;
};

const StyledBoardTitle = styled(Text, {
  fontWeight: '$bold',
  fontSize: '$14',
  letterSpacing: '$0-17',
  wordBreak: 'break-word',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  maxWidth: '$260',
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

const CardTitle: React.FC<CardTitleProps> = ({ teamId, title, isTeamPage }) =>
  isTeamPage ? (
    <Link
      key={teamId}
      href={{
        pathname: `teams/[teamId]`,
        query: { teamId },
      }}
    >
      <StyledBoardTitle>{title}</StyledBoardTitle>
    </Link>
  ) : (
    <StyledBoardTitle
      css={{
        '@hover': {
          '&:hover': {
            textDecoration: 'none',
            cursor: 'auto',
          },
        },
      }}
    >
      {title}
    </StyledBoardTitle>
  );

export default CardTitle;

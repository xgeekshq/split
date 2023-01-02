import {
  EmptyBoardsText,
  StyledBox,
  StyledImage,
  StyledNewBoardLink,
} from '@/components/Dashboard/RecentRetros/partials/EmptyBoards/styles';
import Link from 'next/link';

const EmptyTeamBoards: React.FC = () => (
  <StyledBox align="center" direction="column" elevation="1" justify="center">
    <StyledImage />
    <EmptyBoardsText css={{ mt: '$24', textAlign: 'center' }} size="md">
      This team has no retros yet.
      <br />
      <Link href="/boards/new">
        <StyledNewBoardLink underline weight="medium">
          Add a new board
        </StyledNewBoardLink>
      </Link>{' '}
      now.
    </EmptyBoardsText>
  </StyledBox>
);
export default EmptyTeamBoards;

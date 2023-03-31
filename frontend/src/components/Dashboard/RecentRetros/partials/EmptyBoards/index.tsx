import Link from 'next/link';
import Text from '@/components/Primitives/Text/Text';

import { EmptyBoardsText, StyledBox, StyledImage } from './styles';

const EmptyBoards: React.FC = () => (
  <StyledBox align="center" direction="column" elevation="1" justify="center">
    <StyledImage />
    <EmptyBoardsText css={{ mt: '$24', textAlign: 'center' }} size="md">
      You have not participated in any retro yet.
      <br />
      <Link href="/boards/new">
        <Text link fontWeight="medium">
          Add a new retro board
        </Text>
      </Link>{' '}
      now.
    </EmptyBoardsText>
  </StyledBox>
);
export default EmptyBoards;

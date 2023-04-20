import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import Button from '@components/Primitives/Inputs/Button/Button';

type CenterMainBoardProps = {
  countDividedBoards: number;
  handleOpenSubBoards: (e: React.MouseEvent<HTMLButtonElement>) => void;
  openSubBoards: boolean;
};

const CenterMainBoard = ({
  countDividedBoards,
  handleOpenSubBoards,
  openSubBoards,
}: CenterMainBoardProps) => (
  <Flex css={{ ml: '$40', display: 'flex', alignItems: 'center' }} gap="8">
    <Text color="primary300" css={{ textAlign: 'end' }} size="sm">
      Sub-team boards
    </Text>
    <Separator orientation="vertical" size="md" />
    <Text color="primary800" css={{ display: 'flex' }} size="md">
      {countDividedBoards}
    </Text>
    <Button isIcon onClick={handleOpenSubBoards}>
      <Icon
        name={`arrow-${!openSubBoards ? 'down' : 'up'}`}
        css={{
          width: '$24',
          height: '$24',
        }}
      />
    </Button>
  </Flex>
);

export default CenterMainBoard;

import Icon from '@/components/icons/Icon';
import Tooltip from '@/components/Primitives/Tooltip';
import BoardType from '@/types/board/board';
import isEmpty from '@/utils/isEmpty';

type CardIconProps = {
  board: BoardType;
  toAdd: boolean;
  isParticipating: boolean;
  havePermissions: boolean;
};

const CardIcon: React.FC<CardIconProps> = ({
  board,
  toAdd = false,
  isParticipating = false,
  havePermissions = false,
}) => {
  const { team, dividedBoards } = board;
  const isDividedBoardsEmpty = isEmpty(dividedBoards);
  if (!isDividedBoardsEmpty || toAdd) {
    return (
      <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
        <div>
          <Icon
            name="blob-split"
            css={{
              width: '31px',
              height: '$32',
              zIndex: 1,
              opacity: isParticipating || havePermissions ? 1 : 0.4,
            }}
          />
        </div>
      </Tooltip>
    );
  }

  if (isDividedBoardsEmpty && team) {
    return (
      <Icon
        name="blob-team"
        css={{
          width: '31px',
          height: '$32',
          color: '$primary400',
          zIndex: 1,
          opacitity: isParticipating ? 1 : 0.4,
        }}
      />
    );
  }

  if (isDividedBoardsEmpty && !team) {
    return (
      <Icon
        name="blob-personal"
        css={{
          width: '31px',
          height: '$32',
          zIndex: 1,
          opacitity: isParticipating ? 1 : 0.4,
          color: '$primary400',
        }}
      />
    );
  }
  return null;
};

export default CardIcon;

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import { Popover, PopoverContent } from '@/components/Primitives/Popover';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import useColumn from '@/hooks/useColumn';
import CardType from '@/types/card/card';
import { useState } from 'react';
import ColorSquare from '../ColorSquare';
import { SwitchDefaultText } from '../SwitchDefaultText';

import { PopoverItemStyled, PopoverTriggerStyled } from './styles';

type OptionsMenuProps = {
  disabled?: boolean;
  isRegularBoard?: boolean;
  cards: CardType[];
  title: string;
  columnId: string;
  boardId: string;
};

const colors = [
  '$highlight1Light',
  '$highlight2Light',
  '$highlight3Light',
  '$highlight4Light',
  '$infoLighter',
  '$warningLighter',
];

const OptionsMenu = ({
  disabled,
  isRegularBoard,
  cards,
  title,
  columnId,
  boardId,
}: OptionsMenuProps) => {
  const [defaultText, setDefaultText] = useState(false);

  const {
    updateColumn: { mutate },
  } = useColumn();

  const handleDefaultTextCheck = () => {
    setDefaultText(!defaultText);
  };

  const handleColorChange = (selectedColor: string) => {
    const column = {
      _id: columnId,
      title,
      color: selectedColor,
      cards,
      cardText: '',
      boardId,
    };

    mutate(column);
  };

  return (
    <Popover>
      <PopoverTriggerStyled disabled={disabled}>
        <Icon name="menu-dots" size={24} />
      </PopoverTriggerStyled>
      {!disabled && (
        <PopoverContent>
          <PopoverItemStyled>
            <Icon name="boards" size={24} />
            <Text size="sm">Edit column name </Text>
          </PopoverItemStyled>
          {isRegularBoard && (
            <>
              <PopoverItemStyled onClick={() => handleColorChange('$highlight4Light')}>
                <Icon name="recurring" size={24} />
                <Text size="sm">Empty column cards</Text>
              </PopoverItemStyled>

              <PopoverItemStyled>
                <Flex align="center" gap={8}>
                  <Icon name="file-alt" size={24} />
                  <Text size="sm">Activate card default text</Text>
                  <SwitchDefaultText
                    handleCheckedChange={handleDefaultTextCheck}
                    isChecked={defaultText}
                  />
                </Flex>
              </PopoverItemStyled>

              <PopoverItemStyled>
                <Icon name="trash-alt" size={24} />
                <Text size="sm">Delete column</Text>
              </PopoverItemStyled>
            </>
          )}
          <Separator orientation="horizontal" css={{ mt: '$5' }} />
          <Flex gap={8} css={{ pb: '$8', pt: '$20', pl: '$18' }}>
            <Text size="xs" color="primary800" weight="medium">
              Cards color
            </Text>
          </Flex>
          <Flex direction="row" align="center" css={{ pb: '$10', pl: '$3' }}>
            {colors.map((square) => (
              <ColorSquare key={square} color={square} handleColorChange={handleColorChange} />
            ))}
          </Flex>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default OptionsMenu;

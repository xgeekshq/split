import { PopoverItemSquareStyled } from '@/components/Board/Column/partials/OptionsMenu/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

type ColorSquareProps = {
  color: string;
  handleColorChange: (value: string) => void;
};

const ColorSquare = ({ color, handleColorChange }: ColorSquareProps) => (
  <PopoverItemSquareStyled onClick={() => handleColorChange(color)}>
    <Flex css={{ backgroundColor: color, width: '$20', height: '$20', borderRadius: '$4' }} />
  </PopoverItemSquareStyled>
);

export default ColorSquare;

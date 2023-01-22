import Flex from '@/components/Primitives/Flex';
import { PopoverItemSquareStyled } from '../OptionsMenu/styles';

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

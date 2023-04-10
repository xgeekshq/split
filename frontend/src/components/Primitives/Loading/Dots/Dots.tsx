import StyledDots from '@/components/Primitives/Loading/Dots/styles';
import { CSSProps } from '@/styles/stitches/stitches.config';

type Props = CSSProps & {
  size?: 8 | 4 | 10 | 15 | 50 | 80 | 100;
  color?: 'primary800' | 'primary200' | 'white';
};

const Dots = ({ css, size = 15, color = 'primary800', ...props }: Props) => (
  <StyledDots {...props} color={color} css={css} size={size}>
    <span />
    <span />
    <span />
  </StyledDots>
);

export default Dots;

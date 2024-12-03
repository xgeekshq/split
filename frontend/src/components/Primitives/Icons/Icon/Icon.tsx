import Svg from '@/components/Primitives/Icons/Svg/Svg';
import { CSSProps } from '@/styles/stitches/stitches.config';

type Props = CSSProps & {
  name: string;
  size?: 100 | 60 | 48 | 40 | 32 | 28 | 24 | 20 | 18 | 16 | 12;
};

const Icon = ({ name, size = 24, css, ...props }: Props) => (
  <Svg css={css} size={size} {...props}>
    <use href={`#${name}`} />
  </Svg>
);

export default Icon;

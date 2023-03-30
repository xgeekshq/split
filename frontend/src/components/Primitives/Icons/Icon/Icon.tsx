import { CSSProps } from '@/styles/stitches/stitches.config';

import Svg from '@/components/Primitives/Icons/Svg/Svg';

type Props = CSSProps & {
  name: string;
  size?: 100 | 48 | 40 | 32 | 28 | 24 | 20 | 18 | 16 | 12;
};

const Icon = ({ name, size, css, ...props }: Props) => (
  <Svg css={css} size={size} {...props}>
    <use href={`#${name}`} />
  </Svg>
);
Icon.defaultProps = { size: 24 };

export default Icon;

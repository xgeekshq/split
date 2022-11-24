import { CSSProps } from '@/styles/stitches/stitches.config';

import { Loading } from '../Loading';
import { Overlay } from './styles';

type Props = CSSProps & {
  size?: 50 | 80 | 100 | 150 | 220;
};

const LoadingPage = ({ size, css, ...props }: Props) => (
  <Overlay align="center" css={css} justify="center" {...props}>
    <Loading color="white" size={size} />
  </Overlay>
);

LoadingPage.defaultProps = {
  size: 100,
};

export default LoadingPage;

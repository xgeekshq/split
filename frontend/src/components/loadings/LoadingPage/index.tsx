import { CSSProps } from '@/styles/stitches/stitches.config';

import Spinner from '../../Primitives/Loading/Spinner';
import { Overlay } from './styles';

type Props = CSSProps & {
  size?: 50 | 80 | 100 | 150 | 200;
};

const LoadingPage = ({ size, css, ...props }: Props) => (
  <Overlay align="center" css={css} justify="center" {...props}>
    <Spinner color="light" size={size} />
  </Overlay>
);

LoadingPage.defaultProps = {
  size: 100,
};

export default LoadingPage;

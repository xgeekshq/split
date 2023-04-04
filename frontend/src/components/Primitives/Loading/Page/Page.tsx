import { styled, CSSProps } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Spinner from '@/components/Primitives/Loading/Spinner/Spinner';

const Overlay = styled('div', Flex, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
  width: '100%',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.9)',
});

type Props = CSSProps & {
  size?: 50 | 80 | 100 | 150 | 200;
};

const LoadingPage = ({ size = 100, css, ...props }: Props) => (
  <Overlay align="center" css={css} justify="center" {...props}>
    <Spinner color="light" size={size} />
  </Overlay>
);

export default LoadingPage;

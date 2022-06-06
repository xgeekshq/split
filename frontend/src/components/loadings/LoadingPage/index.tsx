import { CSSProps } from 'styles/stitches/stitches.config';

import { Loading } from '../Loading';
import { Overlay } from './styles';

type Props = CSSProps & {
	size?: 50 | 80 | 100 | 150 | 220;
};

const LoadingPage = ({ size, css, ...props }: Props) => {
	return (
		<Overlay align="center" justify="center" css={css} {...props}>
			<Loading color="white" size={size} />
		</Overlay>
	);
};

LoadingPage.defaultProps = {
	size: 100
};

export default LoadingPage;

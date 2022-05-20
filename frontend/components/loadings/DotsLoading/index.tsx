import { CSSProps } from '../../../stitches.config';
import { Dots } from './styles';

type Props = CSSProps & {
	size?: 8 | 4 | 10 | 15 | 50 | 80 | 100;
	color?: 'primary800' | 'primary200' | 'white';
};

const DotsLoading = ({ css, size, color, ...props }: Props) => {
	return (
		<Dots {...props} css={css} size={size} color={color}>
			<span />
			<span />
			<span />
		</Dots>
	);
};

DotsLoading.defaultProps = {
	size: 15,
	color: 'primary800'
};

export { DotsLoading };

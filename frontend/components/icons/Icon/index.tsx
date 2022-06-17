import React from 'react';

import { CSSProps } from '../../../stitches.config';
import Svg from '../../Primitives/Svg';

type Props = CSSProps & {
	name: string;
	size?: 32 | 24 | 20 | 18 | 16 | 12;
};

const Icon = ({ name, size, css, ...props }: Props) => {
	return (
		<Svg size={size} css={css} {...props}>
			<use href={`#${name}`} />
		</Svg>
	);
};

Icon.defaultProps = {
	size: undefined
};

export default Icon;

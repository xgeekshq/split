import React from 'react';

import { CSSProps } from 'styles/stitches/stitches.config';

import Svg from 'components/Primitives/Svg';

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
	size: 24
};

export default Icon;

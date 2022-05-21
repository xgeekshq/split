import React from 'react';

import { CSSProps } from '../../../stitches.config';
import Svg from '../../Primitives/Svg';

type Props = CSSProps & {
	name: string;
};

const Icon = ({ name, css, ...props }: Props) => {
	return (
		<Svg
			css={
				css || {
					width: '$24',
					height: '$24'
				}
			}
			{...props}
		>
			<use href={`#${name}`} />
		</Svg>
	);
};

export default Icon;

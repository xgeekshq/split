import React from 'react';

import { CSSProps } from '../../../stitches.config';
import Svg from '../../Primitives/Svg';

type Props = CSSProps & {
	onClick?: () => void;
	name: string;
};

const Icon = ({ name, onClick, css, ...props }: Props) => {
	return (
		<Svg
			onClick={onClick}
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

Icon.defaultProps = {
	onClick: undefined
};

export default Icon;

import { styled } from '@stitches/react';

import Flex from '../../Primitives/Flex';

const Overlay = styled('div', Flex, {
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,

	width: '100%',
	height: '100vh',

	backgroundColor: 'rgba(0,0,0,0.9)'
});

export { Overlay };

import { styled } from 'styles/stitches/stitches.config';

import Flex from 'components/Primitives/Flex';

const CardsContainer = styled(Flex, {
	mt: '$20',
	px: '$20',
	overflowX: 'hidden',
	overflowY: 'auto',
	maxHeight: 'calc(100vh - 450px)',

	'&::-webkit-scrollbar': {
		width: '$4'
	},
	'&::-webkit-scrollbar-track': {
		background: 'transparent',
		borderRadius: '$pill'
	},
	'&::-webkit-scrollbar-thumb': {
		background: '$primary200',
		borderRadius: '$pill',

		'&:hover': {
			background: '$primary400'
		}
	}
});

export { CardsContainer };

import { styled } from 'styles/stitches/stitches.config';

import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';

const ContentSection = styled('section', Flex, {
	width: '100%',
	height: '100%'
});

const AddNewBoardButton = styled('a', Button, {
	width: 'fit-content',
	display: 'flex',
	position: 'relative',
	height: '$48',
	fontWeight: '$medium !important',
	lineHeight: '$20 !important'
});

export { AddNewBoardButton, ContentSection };

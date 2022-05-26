import { styled } from '../../../stitches.config';
import Flex from '../Flex';
import Text from '../Text';

const StyledDialogTitle = styled(Text, {
	maxWidth: '85%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontWeight: '400 !important',

	'&>span': {
		fontWeight: '$bold'
	}
});

const DialogText = styled(Flex, {
	px: '$32',
	pt: '$24',

	'&>p': {
		margin: 0
	}
});

const DialogButtons = styled(Flex, {
	py: '$32',
	px: '$32'
});

export { DialogButtons, DialogText, StyledDialogTitle };

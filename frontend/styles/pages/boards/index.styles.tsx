import Text from '../../../components/Primitives/Text';
import { styled } from '../../../stitches.config';

const StyledTextTab = styled(Text, {
	pb: '$12 !important',
	lineHeight: '$20',
	'&:hover': {
		cursor: 'pointer'
	},
	'&[data-activetab=\'true\']': {
		boxSizing: 'border-box',
		borderBottom: '2px solid $colors$primary800',
		fontWeight: '$bold',
		fontSize: '$16',
		letterSpacing: '$0-2',
		color: '$primary800'
	}
});

export { StyledTextTab };

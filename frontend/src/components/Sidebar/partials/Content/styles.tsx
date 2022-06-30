import { styled } from 'styles/stitches/stitches.config';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import Separator from '../Separator';

const StyledMenuItem = styled(Flex, {
	variants: {
		disabled: {
			true: {
				'&:hover': {
					cursor: 'not-allowed'
				}
			}
		}
	},

	pl: '$22',
	py: '$12',
	height: '$48',
	gap: '$14',
	alignItems: 'center',
	transition: 'all 0.3s',

	'& svg': { color: '$primary300', width: '$24', height: '$24' },

	'&[data-active="true"]': {
		'& svg': {
			color: '$white'
		},
		'& span': {
			color: '$white',
			fontWeight: '$medium'
		},
		backgroundColor: '$primary600'
	},

	'&:hover': {
		cursor: 'pointer',

		'&:not(&[data-active="true"])': {
			backgroundColor: '$primary700',

			'& svg': {
				color: '$primary200'
			},
			'& span': {
				color: '$primary200',
				fontWeight: '$medium'
			}
		}
	}
});

const StyledText = styled(Text, {
	fontSize: '$14',
	color: '$primary300',
	lineHeight: '$20'
});

const StyledSeparator = styled(Separator, { marginTop: '$16', marginBottom: '$16' });

export { StyledMenuItem, StyledSeparator, StyledText };

import { styled } from 'styles/stitches/stitches.config';

import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';

const StyledForm = styled('form', Flex, { width: '100%' });

const LoginButton = styled(Button, {
	fontWeight: '$medium',
	'& svg': {
		height: '$40 !important',
		width: '$40 !important'
	}
});

const StyledHoverIconFlex = styled('div', Flex, {
	'&:hover': {
		'&[data-loading="true"]': {
			cursor: 'default'
		},
		'&[data-loading="false"]': {
			cursor: 'pointer'
		}
	}
});

const OrSeparator = styled('div', {
	display: 'flex',
	alignItems: 'center',

	width: '100%',

	mt: '$26',
	mb: '$32',

	hr: {
		flexGrow: 1,
		height: 1,
		margin: 0,
		border: 0,
		backgroundColor: '$primary100'
	},

	span: {
		px: '$14',
		textTransform: 'uppercase !important'
	}
});

export { LoginButton, OrSeparator, StyledForm, StyledHoverIconFlex };

import { styled } from 'styles/stitches/stitches.config';

const ButtonAddMember = styled('button', {
	color: 'black',
	display: 'flex',
	alignItems: 'center',
	backgroundColor: 'transparent',
	border: 0,
	fontSize: '13px',
	'&:hover': {
		cursor: 'pointer',
		textDecoration: 'underline'
	}
});

export { ButtonAddMember };

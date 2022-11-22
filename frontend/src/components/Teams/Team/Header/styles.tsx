import { styled } from 'styles/stitches/stitches.config';

const StyledHeader = styled('div', {
	width: '100%',
	maxHeight: '108px',

	position: 'relative',

	padding: '$24 $37',
	borderBottomStyle: 'solid',
	borderBottomWidth: 1,
	borderBottomColor: '$primary100',

	backgroundColor: '$surface'
});

const TitleSection = styled('section', {
	display: 'flex',
	alignItems: 'center',
	gap: '$10'
});

export { StyledHeader, TitleSection };

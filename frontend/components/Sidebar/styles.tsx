import { styled } from '../../stitches.config';

const StyledSidebar = styled('aside', {
	width: '256px',
	height: '100%',

	/**
	 * Position fixed
	 * avoiding problems with scrools
	 */
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,

	backgroundColor: '$primary800'
});

export { StyledSidebar };

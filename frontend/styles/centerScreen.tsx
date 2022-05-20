import { css } from '../stitches.config';

const centerScreen = css({
	backgroundColor: 'white',
	position: 'fixed',
	top: '50%',
	right: '50%',
	'&:focus': { outline: 'none' }
});

export default centerScreen;

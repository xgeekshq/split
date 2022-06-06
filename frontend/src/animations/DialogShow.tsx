import { keyframes } from 'styles/stitches/stitches.config';

export const overlayShow = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 }
});

export const contentShow = keyframes({
	'0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
	'100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
});

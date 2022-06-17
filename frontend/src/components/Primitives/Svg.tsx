import { styled } from 'styles/stitches/stitches.config';

const Svg = styled('svg', {
	variants: {
		size: {
			32: {
				size: '$32'
			},
			24: {
				size: '$24'
			},
			20: {
				size: '$20'
			},
			18: {
				size: '$18'
			},
			16: {
				size: '$16'
			},
			12: {
				size: '$12'
			}
		}
	}
});

export default Svg;

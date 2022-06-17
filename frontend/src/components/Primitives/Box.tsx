import { styled } from 'styles/stitches/stitches.config';

const Box = styled('div', {
	background: '$background',
	borderRadius: '$8',
	variants: {
		elevation: {
			0: {
				boxShadow: '0px 1px 2px rgba(18, 25, 34, 0.05)'
			},
			1: {
				boxShadow: '0px 1px 4px rgba(18, 25, 34, 0.05)'
			},
			2: {
				boxShadow: '0px 2px 8px rgba(18, 25, 34, 0.05)'
			},
			3: {
				boxShadow: '0px 4px 16px rgba(18, 25, 34, 0.05)'
			},
			4: {
				boxShadow: '0px 8px 24px rgba(18, 25, 34, 0.05)'
			}
		},
		variant: {
			bordered: {
				boxShadow: '0 0 0 1px #CBD2D9'
			},
			dropdown: {
				boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)'
			}
		}
	}
});

export default Box;

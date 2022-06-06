import { keyframes, styled } from 'styles/stitches/stitches.config';

const scale = keyframes({
	'0%': {
		transfomr: 'scale(1)',
		opacity: 1
	},
	'45%': {
		transform: 'scale(0)',
		opacity: 0.5
	},
	'80%': {
		transform: 'scale(1)',
		opacity: 1
	}
});

const Dots = styled('div', {
	variants: {
		size: {
			4: {
				span: {
					width: '$4',
					height: '$4'
				}
			},
			8: {
				span: {
					width: '$8',
					height: '$8'
				}
			},
			10: {
				span: {
					width: '$10',
					height: '$10'
				}
			},
			15: {
				span: {
					width: '15px',
					height: '15px'
				}
			},
			50: {
				span: {
					width: '50px',
					height: '50px'
				}
			},
			80: {
				span: {
					width: '$80',
					height: '$80'
				}
			},
			100: {
				span: {
					width: '$100',
					height: '$100'
				}
			}
		},
		color: {
			primary800: {
				span: {
					backgroundColor: '$primary800'
				}
			},
			primary200: {
				span: {
					backgroundColor: '$primary200'
				}
			},
			white: {
				span: {
					backgroundColor: '$white'
				}
			}
		}
	},

	defaultVariants: {
		size: 15,
		color: 'primary800'
	},

	display: 'inline-flex',
	alignItems: 'center',
	gap: '$2',

	span: {
		display: 'inline-block',

		borderRadius: '100%',

		animationFillMode: 'both',

		'&:nth-of-type(1)': {
			animation: `${scale} 1s calc((1 * 0.12s) - (0.12s * 3)) infinite cubic-bezier(.2,.68,.18,1.08)`
		},

		'&:nth-of-type(2)': {
			animation: `${scale} 1s calc((2 * 0.12s) - (0.12s * 3)) infinite cubic-bezier(.2,.68,.18,1.08)`
		},

		'&:nth-of-type(3)': {
			animation: `${scale} 1s calc((3 * 0.12s) - (0.12s * 3)) infinite cubic-bezier(.2,.68,.18,1.08)`
		}
	}
});

export { Dots };

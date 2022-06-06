import { styled } from 'styles/stitches/stitches.config';

const StyledBreadcrumbItem = styled('li', {
	variants: {
		isActive: {
			true: {
				color: '$primary800',

				'& a': {
					color: '$primary800'
				}
			},
			false: {
				color: '$primary300'
			}
		}
	},

	fontSize: '$14',

	a: {
		color: '$primary300',
		textDecoration: 'none',

		'&:hover': {
			color: '$primary800'
		}
	}
});

export { StyledBreadcrumbItem };

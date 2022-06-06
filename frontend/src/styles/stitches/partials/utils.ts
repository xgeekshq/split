import * as Stitches from '@stitches/react';

const utils = {
	p: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingTop: value,
		paddingBottom: value,
		paddingLeft: value,
		paddingRight: value
	}),
	pt: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingTop: value
	}),
	pr: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingRight: value
	}),
	pb: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingBottom: value
	}),
	pl: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingLeft: value
	}),
	px: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingLeft: value,
		paddingRight: value
	}),
	py: (value: Stitches.PropertyValue<'padding'>) => ({
		paddingTop: value,
		paddingBottom: value
	}),
	m: (value: Stitches.PropertyValue<'margin'>) => ({
		marginTop: value,
		marginBottom: value,
		marginLeft: value,
		marginRight: value
	}),
	mt: (value: Stitches.PropertyValue<'margin'>) => ({
		marginTop: value
	}),
	mr: (value: Stitches.PropertyValue<'margin'>) => ({
		marginRight: value
	}),
	mb: (value: Stitches.PropertyValue<'margin'>) => ({
		marginBottom: value
	}),
	ml: (value: Stitches.PropertyValue<'margin'>) => ({
		marginLeft: value
	}),
	mx: (value: Stitches.PropertyValue<'margin'>) => ({
		marginLeft: value,
		marginRight: value
	}),
	my: (value: Stitches.PropertyValue<'margin'>) => ({
		marginTop: value,
		marginBottom: value
	}),
	size: (value: Stitches.PropertyValue<'width'>) => ({
		width: value,
		height: value
	}),
	bc: (value: Stitches.PropertyValue<'backgroundColor'>) => ({
		backgroundColor: value
	})
};

export { utils };

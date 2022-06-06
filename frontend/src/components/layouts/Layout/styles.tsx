import { styled } from 'styles/stitches/stitches.config';

const Container = styled('main', {
	width: 'calc(100vw - 256px)',
	height: '100vh',

	padding: '$64 $48 $24 $48',
	marginLeft: 'auto',

	overflow: 'hidden'
});

export { Container };

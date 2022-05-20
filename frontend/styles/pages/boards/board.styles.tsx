import { styled } from '../../../stitches.config';
import Flex from '../../../components/Primitives/Flex';

const Container = styled(Flex, {
	// remove 108px from header to the 100vh
	maxHeight: 'calc(100vh - 108px)',
	overflow: 'hidden',

	alignItems: 'flex-start',
	justifyContent: 'center',
	gap: '$8'
});

export { Container };

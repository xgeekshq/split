import { styled } from '../../../stitches.config';
import Flex from '../../Primitives/Flex';

const ScrollableContent = styled(Flex, {
	mt: '$24',
	height: 'calc(100vh - 300px)',
	overflowY: 'auto',
	pr: '$10',
	pb: '$10'
});

export { ScrollableContent };

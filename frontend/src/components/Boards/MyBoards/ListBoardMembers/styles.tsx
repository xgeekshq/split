import { styled } from '../../../../styles/stitches/stitches.config';
import Flex from '../../../Primitives/Flex';

const ScrollableContent = styled(Flex, {
	mt: '$24',
	height: 'calc(100vh - 100px)',
	overflowY: 'auto',
	pr: '$10',
	pb: '$10'
});

export { ScrollableContent };

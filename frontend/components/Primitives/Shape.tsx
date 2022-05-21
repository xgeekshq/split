import { styled } from '../../stitches.config';
import Flex from './Flex';

const Shape = styled('div', Flex, {
	boxShadow: '0 2px 10px rgb(62 62 82 / 30%)',
	variants: {
		variant: {
			circle: {
				borderRadius: '$round'
			}
		},
		bColor: {
			gray: {
				backgroundColor: '$gray8'
			}
		}
	}
});

export default Shape;

import { styled } from '../../../../styles/stitches/stitches.config';
import Text from '../../../Primitives/Text';

const TextWhite = styled(Text, { color: 'white', mt: '$24' });
const LiWhite = styled('li', Text, { color: '$primary100', fontSize: '$14', lineHeight: '$20' });

export { LiWhite, TextWhite };

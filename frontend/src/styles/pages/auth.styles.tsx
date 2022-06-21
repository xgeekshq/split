import { styled } from 'styles/stitches/stitches.config';

import Flex from 'components/Primitives/Flex';

const CenteredContainer = styled('div', {
	position: 'absolute',
	top: '50%',
	right: '150px',

	transform: 'translateY(-50%)',

	maxWidth: '500px',
	height: 'fit-content',

	display: 'flex',
	flexDirection: 'column',

	backgroundColor: '#ffffff',
	borderRadius: '$12'
});
const ImageBackground = styled(Flex, {
	height: '100vh',
	width: '100%',
	position: 'relative',
	backgroundColor: '$black',
	backgroundImage: 'url(images/background.svg)',
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat'
});

const BannerContainer = styled(Flex, {
	size: 'fit-content',

	position: 'absolute',
	left: '112px',
	top: '72px'
});

export { BannerContainer, CenteredContainer, ImageBackground };

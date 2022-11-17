import { styled } from 'styles/stitches/stitches.config';

import Flex from 'components/Primitives/Flex';

const CenteredContainer = styled('div', {
	position: 'absolute',
	top: '5%',
	right: '$150',

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
	backgroundImage: 'url(/images/background.svg)',
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	overflow: 'auto'
});

const BannerContainer = styled(Flex, {
	size: 'fit-content',
	position: 'absolute',
	left: '112px',
	top: '72px'
});

export { BannerContainer, CenteredContainer, ImageBackground };

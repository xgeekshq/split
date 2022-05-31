import { styled } from 'styles/stitches/stitches.config';

import Flex from 'components/Primitives/Flex';

const CenteredContainer = styled(Flex, {
	position: 'absolute',
	top: '$202',
	right: '$162',
	boxSizing: 'border-box',
	'@media (max-height: 1023px)': {
		top: 'calc((100vh - 710px) / 2)'
	},
	'&:focus': { outline: 'none' }
});

const MainContainer = styled(Flex, {
	height: '100vh',
	width: '100%',
	position: 'relative',
	backgroundColor: '$black',
	backgroundImage: 'url(images/background.svg)',
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat'
});

const BannerContainer = styled(Flex, {
	mt: '$72',
	ml: '$112',
	size: 'fit-content'
});

export { BannerContainer, CenteredContainer, MainContainer };

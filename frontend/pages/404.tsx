import Link from 'next/link';

import Banner from '../components/icons/Banner';
import LogoIcon from '../components/icons/Logo';
import Text from '../components/Primitives/Text';
import {
	BannerContainer,
	ContainerSection,
	GoBackButton,
	ImageBackground
} from '../styles/pages/404.styles';

export default function Custom404() {
	return (
		<ImageBackground>
			<BannerContainer>
				<Banner />
			</BannerContainer>

			<ContainerSection>
				<LogoIcon />

				<Text size="xl" css={{ mt: '$29', fontSize: '$48' }} heading="1">
					404
				</Text>

				<Text css={{ mt: '$10' }} heading="2" weight="medium">
					Page Not Found
				</Text>
				<Text size="md" color="primary500" css={{ mt: '$24' }}>
					The page you are looking for might have been removed or is temporarily
					unavailable
				</Text>
				<Link href="/">
					<GoBackButton
						variant="primary"
						size="md"
						css={{ mt: '$26' }}
						style={{ width: '100%' }}
					>
						Go to Home
					</GoBackButton>
				</Link>
			</ContainerSection>
		</ImageBackground>
	);
}

import Link from 'next/link';

import {
	BannerContainer,
	ContainerSection,
	GoBackButton,
	ImageBackground
} from 'styles/pages/error.styles';

import Banner from 'components/icons/Banner';
import LogoIcon from 'components/icons/Logo';
import Text from 'components/Primitives/Text';

export default function Custom404() {
	return (
		<ImageBackground>
			<BannerContainer>
				<Banner />
			</BannerContainer>

			<ContainerSection>
				<LogoIcon />

				<Text css={{ mt: '$29', fontSize: '$48' }} heading="1" size="xl">
					404
				</Text>

				<Text css={{ mt: '$10' }} heading="2" weight="medium">
					Page Not Found
				</Text>
				<Text color="primary500" css={{ mt: '$24' }} size="md">
					The page you are looking for might have been removed or is temporarily
					unavailable
				</Text>
				<Link href="/">
					<GoBackButton
						css={{ mt: '$26' }}
						size="md"
						style={{ width: '100%' }}
						variant="primary"
					>
						Go to Home
					</GoBackButton>
				</Link>
			</ContainerSection>
		</ImageBackground>
	);
}

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

const Custom500 = () => {
	return (
		<ImageBackground>
			<BannerContainer>
				<Banner />
			</BannerContainer>

			<ContainerSection>
				<LogoIcon />

				<Text css={{ mt: '$29', fontSize: '$48' }} heading="1" size="xl">
					500
				</Text>

				<Text css={{ mt: '$10' }} heading="2" weight="medium">
					Server Error
				</Text>
				<Text color="primary500" css={{ mt: '$24' }} size="md">
					Try to refresh this page or feel free to contact us if the problem persists.
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
};
export default Custom500;

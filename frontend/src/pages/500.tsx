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

				<Text size="xl" css={{ mt: '$29', fontSize: '$48' }} heading="1">
					500
				</Text>

				<Text css={{ mt: '$10' }} heading="2" weight="medium">
					Server Error
				</Text>
				<Text size="md" color="primary500" css={{ mt: '$24' }}>
					Try to refresh this page or feel free to contact us if the problem persists.
				</Text>
				<Link href="/Users/danielsousa/Developer/open-source/divide-and-conquer/frontend/src/pages">
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
};
export default Custom500;

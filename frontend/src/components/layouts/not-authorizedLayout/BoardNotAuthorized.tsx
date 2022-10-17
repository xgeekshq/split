import Link from 'next/link';

import Banner from 'components/icons/Banner';
import LogoIcon from 'components/icons/Logo';
import Text from 'components/Primitives/Text';
import {
	BannerContainer,
	ContainerSection,
	GoBackButton,
	ImageBackground
} from '../../../styles/pages/error.styles';

export default function BoardNotAuthorized() {
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
					Not authorized
				</Text>
				<Text color="primary500" css={{ mt: '$24' }} size="md">
					You do not have permissions to access this board
				</Text>
				<Link href="/dashboard">
					<GoBackButton
						css={{ mt: '$26' }}
						size="md"
						style={{ width: '100%' }}
						variant="primary"
					>
						Go to Dashboard
					</GoBackButton>
				</Link>
			</ContainerSection>
		</ImageBackground>
	);
}

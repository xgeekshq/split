import { FC } from 'react';
import { SidebarHeader } from 'react-pro-sidebar';

import { styled } from '../../../stitches.config';
import HeaderBannerIcon from '../../icons/HeaderBanner';
import Icon from '../../icons/Icon';
import Flex from '../../Primitives/Flex';
import Text from '../../Primitives/Text';
import Separator from './Separator';

const StyledHeader = styled(SidebarHeader, Flex);

const Header: FC<{ firstName: string; lastName: string; email: string }> = ({
	firstName,
	lastName,
	email
}) => {
	const initialLetters = firstName.charAt(0) + lastName.charAt(0);

	return (
		<StyledHeader direction="column">
			<Flex css={{ p: '$40' }}>
				<HeaderBannerIcon />
			</Flex>
			<Separator />
			<Flex
				align="center"
				gap="12"
				css={{
					p: '$24',
					color: '$white',
					backgroundColor: '$primary700'
				}}
			>
				<Flex
					css={{ width: '57px', height: '58px', position: 'relative' }}
					align="center"
					justify="center"
				>
					<Icon
						name="userIcon"
						css={{
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: '0',
							bottom: '0',
							zIndex: '0',
							left: '0',
							right: '0'
						}}
					/>
					<Text size="md" color="primary800" weight="bold" css={{ zIndex: 1 }}>
						{initialLetters}
					</Text>
				</Flex>
				<Flex direction="column">
					<Text css={{ color: '$white' }} weight="medium" size="sm">
						{`${firstName} ${lastName}`}
					</Text>
					<Text css={{ color: '$primary200' }} weight="medium" size="xs">
						{email}
					</Text>
				</Flex>
			</Flex>
			<Separator />
		</StyledHeader>
	);
};

export default Header;

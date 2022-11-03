import React from 'react';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import { User } from '../../../../types/user/user';
import { ConfigurationSettings } from '../../../Board/Settings/partials/ConfigurationSettings';
import { CardEnd } from '../CardEnd';
import { InnerContainer, StyledMemberTitle } from './styles';

type CardBodyProps = {
	userSAdmin: boolean | undefined;
	member: User;
	role: string;
};

const CardMember = React.memo<CardBodyProps>(({ member, role, userSAdmin }) => {
	return (
		<Flex css={{ flex: '1 1 0', marginBottom: '$10' }} direction="column" gap="12">
			<Flex>
				<InnerContainer
					align="center"
					elevation="1"
					justify="between"
					css={{
						position: 'relative',
						flex: '1 1 0',
						py: '$22',
						maxHeight: '$76',
						ml: 0
					}}
				>
					<Flex align="center">
						<Flex align="center" gap="8">
							<Icon
								name="blob-personal"
								css={{
									width: '32px',
									height: '$32',
									zIndex: 1
								}}
							/>

							<Flex align="center" gap="8">
								<StyledMemberTitle>
									{`${member.firstName} ${member.lastName}`}
								</StyledMemberTitle>
							</Flex>
						</Flex>
					</Flex>

					<Flex align="center" gap="8">
						<ConfigurationSettings
							handleCheckedChange={() => {}}
							isChecked={false}
							text=""
							title="Newbee"
						/>
					</Flex>
					<CardEnd role={role} userSAdmin={userSAdmin} />
				</InnerContainer>
			</Flex>
		</Flex>
	);
});

export default CardMember;

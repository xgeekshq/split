import React from 'react';

import { styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { Team } from 'types/team/team';
import { ConfigurationSettings } from '../../../Board/Settings/partials/ConfigurationSettings';
import { CardEnd } from './CardEnd';

const InnerContainer = styled(Flex, Box, {
	px: '$32',
	backgroundColor: '$white',
	borderRadius: '$12'
});

const StyledBoardTitle = styled(Text, {
	fontWeight: '$bold',
	fontSize: '$14',
	letterSpacing: '$0-17',
	'&[data-disabled="true"]': { opacity: 0.4 },
	'@hover': {
		'&:hover': {
			'&[data-disabled="true"]': {
				textDecoration: 'none',
				cursor: 'default'
			},
			textDecoration: 'underline',
			cursor: 'pointer'
		}
	}
});

type CardBodyProps = {
	userId: string;
	userSAdmin: boolean;
	team?: Team;
};

const CardMember = React.memo<CardBodyProps>(({ userId, userSAdmin }) => {
	return (
		<Flex css={{ flex: '1 1 0' }} direction="column" gap="12">
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
								<StyledBoardTitle>Cátia Antunes</StyledBoardTitle>
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
					<CardEnd userId={userId} userSAdmin={userSAdmin} />
				</InnerContainer>
			</Flex>
		</Flex>
	);
});

export default CardMember;

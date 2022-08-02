import React from 'react';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import Tooltip from 'components/Primitives/Tooltip';
import FakeMainBoardCard from '../MainBoardCard';
import { StyledBox } from './styles';

const FakeTeamTab: React.FC = () => {
	return (
		<Flex css={{ mt: '$32' }} direction="column">
			<Flex css={{ width: '100%' }} gap="22" justify="between">
				<StyledBox
					css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
					direction="column"
					elevation="1"
					gap="2"
				>
					<Text color="primary300" size="xs">
						Team
					</Text>
					<Flex align="center" gap="8">
						<Text size="md" />
						<Text color="primary300" size="md">
							(-- members)
						</Text>
						<Tooltip content="All active members on the platform">
							<div>
								<Icon
									name="info"
									css={{
										width: '$14',
										height: '$14',
										color: '$primary400'
									}}
								/>
							</div>
						</Tooltip>
					</Flex>
				</StyledBox>
				<StyledBox
					css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
					direction="column"
					elevation="1"
					gap="2"
				>
					<Text color="primary300" size="xs">
						Stakeholders
					</Text>
					<Text css={{ wordBreak: 'break-word' }} size="md" />
				</StyledBox>
			</Flex>
			<Flex justify="end">
				<Flex
					align="center"
					gap="8"
					justify="end"
					css={{
						py: '$14',
						cursor: 'pointer',
						transition: 'text-decoration 0.2s ease-in-out',
						'&:hover': {
							'&>span': {
								textDecoration: 'underline'
							}
						}
					}}
				>
					<Icon
						name="edit"
						css={{
							width: '$16',
							height: '$16'
						}}
					/>
					<Text size="sm" weight="medium">
						Quick edit sub-teams configurations
					</Text>
				</Flex>
			</Flex>
			<FakeMainBoardCard />
			{/* <MainBoardCard team={team} stakeholders={stakeholders} /> */}
		</Flex>
	);
};

export default FakeTeamTab;

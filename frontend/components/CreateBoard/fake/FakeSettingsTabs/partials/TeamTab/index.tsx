import React from 'react';

import Icon from '../../../../../icons/Icon';
import Flex from '../../../../../Primitives/Flex';
import Text from '../../../../../Primitives/Text';
import Tooltip from '../../../../../Primitives/Tooltip';
import FakeMainBoardCard from '../MainBoardCard';
import { StyledBox } from './styles';

const FakeTeamTab: React.FC = () => {
	return (
		<Flex css={{ mt: '$32' }} direction="column">
			<Flex gap="22" justify="between" css={{ width: '100%' }}>
				<StyledBox
					elevation="1"
					direction="column"
					gap="2"
					css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
				>
					<Text size="xs" color="primary300">
						Team
					</Text>
					<Flex gap="8" align="center">
						<Text size="md" />
						<Text size="md" color="primary300">
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
					elevation="1"
					direction="column"
					gap="2"
					css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
				>
					<Text size="xs" color="primary300">
						Stakeholders
					</Text>
					<Text size="md" css={{ wordBreak: 'break-word' }} />
				</StyledBox>
			</Flex>
			<Flex justify="end">
				<Flex
					align="center"
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
					gap="8"
				>
					<Icon
						css={{
							width: '$16',
							height: '$16'
						}}
						name="edit"
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

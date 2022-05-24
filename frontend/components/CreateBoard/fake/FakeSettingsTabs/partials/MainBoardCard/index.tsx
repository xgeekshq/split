import React from 'react';

import highlight2Colors from '../../../../../../styles/colors/highlight2.colors';
import LeftArrow from '../../../../../CardBoard/CardBody/LeftArrow';
import Icon from '../../../../../icons/Icon';
import Avatar from '../../../../../Primitives/Avatar';
import Checkbox from '../../../../../Primitives/Checkbox';
import Flex from '../../../../../Primitives/Flex';
import Separator from '../../../../../Primitives/Separator';
import Text from '../../../../../Primitives/Text';
import Tooltip from '../../../../../Primitives/Tooltip';
import FakeCardAvatars from '../CardAvatars';
import { Container, MainContainer } from './styles';

const FakeMainBoardCard = () => {
	return (
		<Flex direction="column" gap="8" css={{ width: '100%', height: '100%' }}>
			<MainContainer elevation="1" justify="between" align="center">
				<Flex>
					<Flex align="center" gap="8">
						<Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
							<div>
								<Icon css={{ width: '31px', height: '$32' }} name="blob-split" />
							</div>
						</Tooltip>
						<Text heading="6">Main Board -</Text>
					</Flex>
					<Flex css={{ ml: '$40' }} align="center">
						<Text size="sm" color="primary300" css={{ mr: '$8' }}>
							Sub-teams/-boards
						</Text>
						<Separator
							orientation="vertical"
							css={{ '&[data-orientation=vertical]': { height: '$12', width: 1 } }}
						/>
						<Text css={{ ml: '$8' }}>2</Text>
						<Flex css={{ ml: '$12' }} gap="4">
							<Flex
								align="center"
								justify="center"
								css={{
									width: '$24',
									height: '$24',
									borderRadius: '$round',
									border: `1px solid $colors$primary200`,
									color: '$colors$primary200',
									transition: 'all 0.2s ease-in-out',

									'&:hover': {
										cursor: 'default',
										backgroundColor: 'white'
									}
								}}
							>
								<Icon
									name="minus"
									css={{
										width: '$10',
										height: '$1'
									}}
								/>
							</Flex>
							<Flex
								align="center"
								justify="center"
								css={{
									width: '$24',
									height: '$24',
									borderRadius: '$round',
									border: `1px solid $primary200`,
									color: '$primary200',
									transition: 'all 0.2s ease-in-out',

									'&:hover': {
										cursor: 'default',
										backgroundColor: 'white'
									}
								}}
							>
								<Icon
									name="plus"
									css={{
										width: '$12',
										height: '$12'
									}}
								/>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex gap="8" align="center">
					<Text weight="medium" size="sm">
						-----
					</Text>
					<FakeCardAvatars />
				</Flex>
			</MainContainer>
			<Flex css={{ mb: '$50' }} direction="column" gap="8">
				<Flex css={{ flex: '1 1 0', width: '100%' }}>
					<LeftArrow isDashboard={false} index={0} />

					<Container
						elevation="1"
						align="center"
						justify="between"
						css={{
							backgroundColor: 'white',
							height: '$64',
							width: '100%',
							ml: '$40',
							py: '$16',
							pl: '$32',
							pr: '$24'
						}}
					>
						<Flex align="center">
							<Text heading="5">Sub-team board 1</Text>
							<Flex align="center">
								<Text css={{ ml: '$40', mr: '$8' }}>Responsible Lottery</Text>
								<Separator
									orientation="vertical"
									css={{
										'&[data-orientation=vertical]': { height: '$12', width: 1 }
									}}
								/>
								<Flex
									css={{
										height: '$24',
										width: '$24',
										borderRadius: '$round',
										border: '1px solid $colors$primary400',
										ml: '$12',
										cursor: 'pointer',

										transtion: 'all 0.2s ease-in-out',

										'&:hover': {
											backgroundColor: '$primary400',
											color: 'white'
										}
									}}
									align="center"
									justify="center"
								>
									<Icon
										name="wand"
										css={{
											width: '$12',
											height: '$12'
										}}
									/>
								</Flex>
								<Text size="sm" color="primary300" css={{ mx: '$8' }}>
									-----
								</Text>
								<Avatar
									css={{ position: 'relative' }}
									size={32}
									colors={{
										bg: highlight2Colors.highlight2Lighter,
										fontColor: highlight2Colors.highlight2Dark
									}}
									fallbackText="-"
								/>
							</Flex>
						</Flex>
						<Flex align="center" gap="8">
							<Text size="sm">-----</Text>
							<FakeCardAvatars />
						</Flex>
					</Container>
				</Flex>
				<Flex css={{ flex: '1 1 0', width: '100%' }}>
					<LeftArrow isDashboard={false} index={1} />

					<Container
						elevation="1"
						align="center"
						justify="between"
						css={{
							backgroundColor: 'white',
							height: '$64',
							width: '100%',
							ml: '$40',
							py: '$16',
							pl: '$32',
							pr: '$24'
						}}
					>
						<Flex align="center">
							<Text heading="5">Sub-team board 2</Text>
							<Flex align="center">
								<Text css={{ ml: '$40', mr: '$8' }}>Responsible Lottery</Text>
								<Separator
									orientation="vertical"
									css={{
										'&[data-orientation=vertical]': { height: '$12', width: 1 }
									}}
								/>
								<Flex
									css={{
										height: '$24',
										width: '$24',
										borderRadius: '$round',
										border: '1px solid $colors$primary400',
										ml: '$12',
										cursor: 'pointer',

										transtion: 'all 0.2s ease-in-out',

										'&:hover': {
											backgroundColor: '$primary400',
											color: 'white'
										}
									}}
									align="center"
									justify="center"
								>
									<Icon
										name="wand"
										css={{
											width: '$12',
											height: '$12'
										}}
									/>
								</Flex>
								<Text size="sm" color="primary300" css={{ mx: '$8' }}>
									-----
								</Text>
								<Avatar
									css={{ position: 'relative' }}
									size={32}
									colors={{
										bg: highlight2Colors.highlight2Lighter,
										fontColor: highlight2Colors.highlight2Dark
									}}
									fallbackText="-"
								/>
							</Flex>
						</Flex>
						<Flex align="center" gap="8">
							<Text size="sm">-----</Text>
							<FakeCardAvatars />
						</Flex>
					</Container>
				</Flex>
			</Flex>
			<Checkbox id="slack" label="Create Slack group for each sub-team" size="16" />
		</Flex>
	);
};

export default FakeMainBoardCard;

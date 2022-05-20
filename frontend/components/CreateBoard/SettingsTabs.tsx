import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '../../stitches.config';
import Flex from '../Primitives/Flex';
import Separator from '../Primitives/Separator';
import Text from '../Primitives/Text';
import BoardConfigurations from './Configurations/BoardConfigurations';
import TeamSubTeamsConfigurations from './SubTeamsTab/TeamSubTeamsConfigurations';

const StyledTextTab = styled(Text, {
	pb: '$12 !important',
	lineHeight: '$20',
	'&:hover': {
		cursor: 'pointer'
	},
	"&[data-activetab='true']": {
		boxSizing: 'border-box',
		borderBottom: '2px solid $colors$primary800',
		fontWeight: '$bold',
		fontSize: '$16',
		letterSpacing: '$0-2',
		color: '$primary800'
	}
});

const Settings = () => {
	const [currentTab, setCurrentTab] = useState(1);

	const {
		formState: { errors }
	} = useFormContext();

	useEffect(() => {
		if (errors.maxVotes) {
			setCurrentTab(2);
		}
	}, [errors.maxVotes]);

	return (
		<Flex direction="column">
			<Flex gap="24" css={{ width: '100%' }}>
				<StyledTextTab
					data-activetab={currentTab === 1}
					size="md"
					color="primary300"
					onClick={() => setCurrentTab(1)}
				>
					Team/-Sub-teams configurations
				</StyledTextTab>
				<StyledTextTab
					data-activetab={currentTab === 2}
					size="md"
					color="primary300"
					onClick={() => setCurrentTab(2)}
				>
					Configurations
				</StyledTextTab>
			</Flex>
			<Separator
				orientation="horizontal"
				css={{ position: 'relative', top: '-1px', zIndex: '-1' }}
			/>
			{currentTab === 1 && <TeamSubTeamsConfigurations />}
			{currentTab === 2 && <BoardConfigurations />}
		</Flex>
	);
};

export default Settings;

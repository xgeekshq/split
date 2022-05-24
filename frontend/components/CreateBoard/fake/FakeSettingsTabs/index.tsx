import React from 'react';

import Flex from '../../../Primitives/Flex';
import Separator from '../../../Primitives/Separator';
import FakeTeamTab from './partials/TeamTab';
import { StyledTextTab } from './styles';

const FakeSettingsTabs = () => {
	return (
		<Flex direction="column">
			<Flex gap="24" css={{ width: '100%' }}>
				<StyledTextTab data-activetab size="md" color="primary300">
					Team/-Sub-teams configurations
				</StyledTextTab>
				<StyledTextTab size="md" color="primary300">
					Configurations
				</StyledTextTab>
			</Flex>
			<Separator
				orientation="horizontal"
				css={{ position: 'relative', top: '-1px', zIndex: '-1' }}
			/>
			<FakeTeamTab />
		</Flex>
	);
};

export default FakeSettingsTabs;

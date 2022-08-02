import React from 'react';

import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import FakeTeamTab from './partials/TeamTab';
import { StyledTextTab } from './styles';

const FakeSettingsTabs = () => {
	return (
		<Flex direction="column">
			<Flex css={{ width: '100%' }} gap="24">
				<StyledTextTab data-activetab color="primary300" size="md">
					Team/-Sub-teams configurations
				</StyledTextTab>
				<StyledTextTab color="primary300" size="md">
					Configurations
				</StyledTextTab>
			</Flex>
			<Separator
				css={{ position: 'relative', top: '-1px', zIndex: '-1' }}
				orientation="horizontal"
			/>
			<FakeTeamTab />
		</Flex>
	);
};

export default FakeSettingsTabs;

import React from 'react';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { Team } from '../../../types/team/team';

type CardEndProps = {
	userId: string;
	userSAdmin?: boolean;
	team?: Team;
};

export const CardEnd: React.FC<CardEndProps> = React.memo(() => {
	return (
		<Flex align="center" css={{ justifySelf: 'end' }}>
			<Text color="primary200" size="sm">
				Role |
			</Text>
			<Text color="primary800" css={{ mx: '$8' }} size="sm" weight="medium">
				Team Admin
			</Text>
		</Flex>
	);
});

import React from 'react';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';

type CardEndProps = {
	userSAdmin?: boolean;
	role: string;
};

export const CardEnd: React.FC<CardEndProps> = React.memo(({ role }) => {
	return (
		<Flex align="center" css={{ justifySelf: 'end' }}>
			<Text color="primary200" size="sm">
				Role |
			</Text>
			<Text color="primary800" css={{ mx: '$8' }} size="sm" weight="medium">
				Team {role.substring(0, 1).toUpperCase() + role.substring(1, role.length)}
			</Text>
		</Flex>
	);
});

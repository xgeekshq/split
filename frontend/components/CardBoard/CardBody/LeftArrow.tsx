import React from 'react';

import Icon from '../../icons/Icon';
import Flex from '../../Primitives/Flex';

type LeftArrowProps = {
	isDashboard: boolean;
	index: number | undefined;
};

const LeftArrow = ({ isDashboard, index }: LeftArrowProps) => {
	return (
		<Flex>
			<Flex css={{ position: 'relative', size: 0 }}>
				{(isDashboard || index === 0) && (
					<Flex css={{ mt: '$11', ml: '$8', mr: '$7' }}>
						<Icon
							name="arrow_long"
							css={{
								width: '$18',
								height: '33px',
								color: '$primary100'
							}}
						/>
						{/* <LateralUpArrow /> */}
					</Flex>
				)}
				{!isDashboard && index !== 0 && (
					<Flex
						css={{
							mt: '$2',
							ml: '13px',
							mr: '$4',
							position: 'relative',
							bottom: '42px'
						}}
					>
						<Icon
							name="line_long"
							css={{
								width: '13px',
								height: '82px',
								color: '$primary100'
							}}
						/>
						{/* <StartArrow /> */}
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default LeftArrow;

import { useCallback, useMemo } from 'react';

import { bubbleColors } from '../../../../../../styles/colors/bubble.colors';
import Avatar from '../../../../../Primitives/Avatar';
import Flex from '../../../../../Primitives/Flex';

const FakeCardAvatars = () => {
	const getRandomColor = useCallback(() => {
		const keys = Object.keys(bubbleColors);
		const value = Math.floor(Math.random() * keys.length);
		return { bg: `$${keys[value]}`, fontColor: `$${bubbleColors[keys[value]]}` };
	}, []);

	const colors = useMemo(() => {
		const col = [];
		for (let i = 0; i < 3; i++) {
			col.push(getRandomColor());
		}
		return col;
	}, [getRandomColor]);

	const renderAvatar = useCallback(
		(value: string, idx) => {
			return (
				<Avatar
					key={`${value}-${idx}-${Math.random()}`}
					css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
					size={32}
					colors={colors[idx]}
					fallbackText={value}
				/>
			);
		},
		[colors]
	);

	return (
		<Flex align="center" css={{ height: 'fit-content', overflow: 'hidden' }}>
			{['-', '-', '-'].map((value, index) => renderAvatar(value, index))}
		</Flex>
	);
};

export default FakeCardAvatars;

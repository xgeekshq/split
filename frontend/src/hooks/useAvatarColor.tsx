import { useCallback, useEffect, useState } from 'react';

import { bubbleColors } from 'styles/stitches/partials/colors/bubble.colors';

type AvatarColor = {
	bg: string;
	fontColor: string;
};

const useAvatarColor = (userId: string): AvatarColor => {
	const [color, setColor] = useState<AvatarColor | undefined>(undefined);

	const getRandomColor = useCallback(() => {
		const keys = Object.keys(bubbleColors);
		const value = Math.floor(Math.random() * keys.length);
		return { bg: `$${keys[value]}`, fontColor: `$${bubbleColors[keys[value]]}` };
	}, []);

	useEffect(() => {
		const localStorageKey = `user_color_${userId}`;
		const userStorage = localStorage.getItem(localStorageKey);

		if (userStorage) {
			const user = JSON.parse(userStorage);
			setColor({
				bg: user.bg,
				fontColor: user.fontColor
			});
		} else {
			const newColor = getRandomColor();
			localStorage.setItem(localStorageKey, JSON.stringify(newColor));
			setColor(newColor);
		}
	}, [userId, getRandomColor]);

	return color as AvatarColor;
};

export default useAvatarColor;

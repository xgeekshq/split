import { useCallback, useMemo, useState } from 'react';

import { getRandomColor } from '@/utils/initialNames';

type AvatarColor = {
  bg: string;
  fontColor: string;
};

const useAvatarColor = (userId: string | undefined, isDefaultColor?: boolean): AvatarColor => {
  const [color, setColor] = useState<AvatarColor | undefined>(undefined);

  // The userIcon sprite is filled with #F3FD58 color that correspond to secondaryBase
  const getDefaultColor = useCallback(
    () => ({ bg: `$secondaryBase`, fontColor: `$secondaryDarkest` }),
    [],
  );

  useMemo(() => {
    const localStorageKey = `user_color_${userId}`;
    const userStorage = localStorage.getItem(localStorageKey);

    if (userStorage !== null && userStorage !== 'undefined') {
      const user = JSON.parse(userStorage);
      setColor({
        bg: user.bg,
        fontColor: user.fontColor,
      });
      return;
    }

    const newColor = isDefaultColor ? getDefaultColor : getRandomColor();
    localStorage.setItem(localStorageKey, JSON.stringify(newColor));
    setColor(newColor);
  }, [userId, isDefaultColor, getDefaultColor]);

  return color as AvatarColor;
};

export default useAvatarColor;

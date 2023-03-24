import { useCallback, useMemo } from 'react';

import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { bubbleColors } from '@/styles/stitches/partials/colors/bubble.colors';

const FakeAvatarGroup = () => {
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
    (value: string, idx: number) => (
      <Avatar
        key={`${value}-${idx}-${Math.random()}`}
        colors={colors[idx]}
        css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
        fallbackText={value}
        size={32}
      />
    ),
    [colors],
  );

  return (
    <Flex align="center" css={{ height: 'fit-content', overflow: 'hidden' }}>
      {['-', '-', '-'].map((value, index) => renderAvatar(value, index))}
    </Flex>
  );
};

export default FakeAvatarGroup;

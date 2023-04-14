import React from 'react';
import { useRecoilValue } from 'recoil';

import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';

type BoardNameProps = {
  title: string;
  description: string;
};

const BoardName = ({ title, description }: BoardNameProps) => {
  const haveError = useRecoilValue(createBoardError);

  return (
    <Flex direction="column" gap={8}>
      <Text heading="3">{title}</Text>
      <Text color="primary500" css={{ mb: '$8' }}>
        {description}
      </Text>
      <Input
        showCount
        disabled={haveError}
        id="text"
        maxChars="45"
        placeholder={title}
        type="text"
      />
    </Flex>
  );
};

export default BoardName;

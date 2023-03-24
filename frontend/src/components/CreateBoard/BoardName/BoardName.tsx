import React from 'react';
import { useRecoilValue } from 'recoil';

import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import Flex from '../../Primitives/Layout/Flex/Flex';

type BoardNameProps = {
  title: string;
  description: string;
};

const BoardName = ({ title, description }: BoardNameProps) => {
  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);

  return (
    <Flex direction="column" gap={8}>
      <Text heading="3">{title}</Text>
      <Text color="primary500" css={{ mb: '$8' }}>
        {description}
      </Text>
      <Input
        disabled={haveError}
        id="text"
        maxChars="45"
        showCount
        placeholder={title}
        type="text"
      />
    </Flex>
  );
};

export default BoardName;

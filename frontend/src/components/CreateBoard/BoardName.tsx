import React from 'react';
import { useRecoilValue } from 'recoil';

import Input from '@/components/Primitives/Input';
import Text from '@/components/Primitives/Text';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';

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
    <>
      <Text heading="3">{title}</Text>
      <Text color="primary500" css={{ mt: '$8', mb: '$16' }}>
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
    </>
  );
};

export default BoardName;

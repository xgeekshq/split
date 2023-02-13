import React from 'react';
import { useRecoilValue } from 'recoil';

import Input from '@/components/Primitives/Input';
import Text from '@/components/Primitives/Text';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';

const BoardName = () => {
  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);

  return (
    <>
      <Text heading="3">Main Board Name</Text>
      <Text color="primary500" css={{ mt: '$8', mb: '$16' }}>
        The main board is the board into which all sub-team boards will be merged.
      </Text>
      <Input
        disabled={haveError}
        id="text"
        maxChars="30"
        showCount
        placeholder="Main board name"
        type="text"
      />
    </>
  );
};

export default BoardName;

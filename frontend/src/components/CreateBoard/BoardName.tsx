import React from 'react';
import { useRecoilValue } from 'recoil';

import Input from '@/components/Primitives/Input';
import Text from '@/components/Primitives/Text';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';

type Props = { mainBoardName: string };

const BoardName = ({ mainBoardName }: Props) => {
  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);

  return (
    <>
      <Text heading="3">Main Board Name</Text>
      <Text css={{ mt: '$8', mb: '$16', color: '$primary500' }}>
        The main board is the board into which all sub-team boards will be merged.
      </Text>
      <Input
        forceState
        currentValue={mainBoardName}
        disabled={haveError}
        id="text"
        maxChars="30"
        placeholder="Main board name"
        state="default"
        type="text"
      />
    </>
  );
};

export default BoardName;

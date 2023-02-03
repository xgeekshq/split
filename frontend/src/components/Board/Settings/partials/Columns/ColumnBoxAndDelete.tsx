import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import { editColumnsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import { DeleteColumnButton } from './DeleteButton';

interface Props {
  title: string;
  index: number;
  disableDeleteColumn?: boolean;
}

const ColumnBoxAndDelete = ({ title, index, disableDeleteColumn }: Props) => {
  const [editColumns, setEditColumns] = useRecoilState(editColumnsState);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const updateColumns = (event: React.ChangeEvent<HTMLInputElement>) => {
    const columns = [...editColumns];

    const columnEditedIdx = columns.findIndex((column) => column.title === title);
    let columnToUpdate = columns.splice(columnEditedIdx, 1)[0];

    columnToUpdate = {
      ...columnToUpdate,
      title: event.target.value,
    };

    columns.splice(columnEditedIdx, 0, columnToUpdate);

    setEditColumns(columns);
  };

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer);

    const newTimer = setTimeout(() => updateColumns(event), 500);

    setTimer(newTimer);
  };

  return (
    <Flex gap={20}>
      <Input
        forceState
        css={{ mb: '0px' }}
        id={`column${index + 1}title`}
        maxChars="30"
        placeholder={`Column ${index + 1}`}
        state="default"
        type="text"
        onChange={handleOnInputChange}
      />
      <Flex direction="column">
        <DeleteColumnButton
          columnTitle={title}
          columnIndex={index}
          disableDeleteColumn={disableDeleteColumn}
        />
      </Flex>
    </Flex>
  );
};

export { ColumnBoxAndDelete };

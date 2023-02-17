import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import { DeleteColumnButton } from './DeleteButton';

interface Props {
  remove: (index?: number | number[]) => void;
  title: string;
  index: number;
  disableDeleteColumn?: boolean;
}

const ColumnBoxAndDelete = ({ remove, title, index, disableDeleteColumn }: Props) => (
  <Flex gap="20">
    <Input
      id={`formColumns.${index}.title`}
      maxChars="30"
      placeholder={`Column ${index + 1}`}
      showCount
      type="text"
    />
    <Flex direction="column">
      <DeleteColumnButton
        columnTitle={title}
        columnIndex={index}
        disableDeleteColumn={disableDeleteColumn}
        remove={remove}
      />
    </Flex>
  </Flex>
);

export { ColumnBoxAndDelete };

import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import { DeleteColumnButton } from './DeleteButton';

interface Props {
  title: string;
  index: number;
  disableDeleteColumn?: boolean;
}

const ColumnBoxAndDelete = ({ title, index, disableDeleteColumn }: Props) => (
  <Flex gap={20}>
    <Input
      forceState
      css={{ mb: '0px' }}
      id={`column${index + 1}title`}
      maxChars="30"
      placeholder={`Column ${index + 1}`}
      state="default"
      type="text"
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

export { ColumnBoxAndDelete };

import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
import Icon from '@/components/icons/Icon';

interface Props {
  onAddColumn: () => void;
}

const AddColumnButton = ({ onAddColumn }: Props) => (
  <Flex
    css={{
      position: 'relative',
      zIndex: '9',
      '& svg': { size: '$16' },
      right: 0,
    }}
    gap="8"
    onClick={onAddColumn}
  >
    <Icon
      name="plus"
      css={{
        width: '$16',
        height: '$32',
        marginRight: '$5',
      }}
    />
    <Text
      heading="6"
      css={{
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        '@hover': {
          '&:hover': {
            cursor: 'pointer',
          },
        },
      }}
    >
      Add new column
    </Text>
  </Flex>
);

export { AddColumnButton };

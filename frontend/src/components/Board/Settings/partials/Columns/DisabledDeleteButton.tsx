import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';

const DisabledDeleteColumnButton = () => (
  <Tooltip content="Your board must have at least one column.">
    <Flex pointer>
      <Icon
        name="trash-alt"
        css={{
          color: '$primary200',
          mt: '$16',
          size: '$20',
          '@hover': {
            '&:hover': {
              cursor: 'not-allowed',
            },
          },
        }}
      />
    </Flex>
  </Tooltip>
);

export { DisabledDeleteColumnButton };

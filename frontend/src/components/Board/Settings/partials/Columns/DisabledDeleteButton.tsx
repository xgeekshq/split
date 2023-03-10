import Flex from '@/components/Primitives/Layout/Flex';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

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

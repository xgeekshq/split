import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';

const NewJoinerTooltip = () => (
  <Flex align="center" data-testid="newJoinerTooltip" gap={8}>
    <Text fontWeight="medium" size="sm">
      New Joiner
    </Text>
    <Tooltip content="The new joiner will not be selected as a responsible for the TEAM sub-teams.">
      <Button isIcon>
        <Icon name="info" />
      </Button>
    </Tooltip>
  </Flex>
);

export default NewJoinerTooltip;

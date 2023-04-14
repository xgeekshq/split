import React from 'react';

import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const Card = ({ display, backgroundColor, children }: any) => (
  <Box css={{ width: '$260' }} variant="bordered">
    <Flex
      justify="center"
      css={{
        py: display ? '$24' : '$64',
        backgroundColor: backgroundColor || '$white',
        borderRadius: '$8 $8 0 0',
      }}
    >
      {display && display}
    </Flex>
    <Flex css={{ p: '$12', borderTop: '1px solid $primary100' }} direction="column">
      {children}
    </Flex>
  </Box>
);

export default Card;

import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import React from 'react';

const Card = ({ display, children }: any) => (
  <Box variant="bordered" css={{ width: '$260' }}>
    <Flex
      css={{ py: '$24', backgroundColor: '$white', borderRadius: '$8 $8 0 0' }}
      justify="center"
    >
      {display}
    </Flex>
    <Flex direction="column" css={{ p: '$12', borderTop: '1px solid $primary100' }}>
      {children}
    </Flex>
  </Box>
);

export default Card;

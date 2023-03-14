import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import React from 'react';

const Card = ({ display, backgroundColor, children }: any) => (
  <Box variant="bordered" css={{ width: '$260' }}>
    <Flex
      css={{
        py: display ? '$24' : '$64',
        backgroundColor: backgroundColor || '$white',
        borderRadius: '$8 $8 0 0',
      }}
      justify="center"
    >
      {display && display}
    </Flex>
    <Flex direction="column" css={{ p: '$12', borderTop: '1px solid $primary100' }}>
      {children}
    </Flex>
  </Box>
);

export default Card;

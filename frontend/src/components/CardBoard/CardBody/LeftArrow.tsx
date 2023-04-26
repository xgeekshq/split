import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export type LeftArrowProps = {
  /*  isLast is used to add a vertical bar at the end, 
      so that it connects to the next element if it's not the last one */
  isLast: boolean;
  isDashboard: boolean;
  index: number | undefined;
};

const LeftArrow = ({ isDashboard, isLast, index }: LeftArrowProps) => (
  <Flex aria-hidden css={{ position: 'relative', width: 'fit-content' }}>
    {(isDashboard || index === 0) && (
      <Flex
        css={{
          position: 'absolute',
          top: '$11',
          left: '$8',
        }}
      >
        <Icon
          name="arrow_long"
          css={{
            width: '$18',
            height: '33px',
            color: '$primary100',
          }}
        />
      </Flex>
    )}
    {!isDashboard && index !== 0 && (
      <Flex
        css={{
          ml: '13px',
          position: 'absolute',
          bottom: '50%',
          borderLeft: '2px solid $primary100',
          borderBottom: '2px solid $primary100',
          height: '70%',
          minWidth: '$12',
          borderBottomLeftRadius: '$5',
        }}
      />
    )}
    {!isLast && (
      <Flex
        css={{
          ml: '13px',
          position: 'absolute',
          top: '20%',
          borderLeft: '2px solid $primary100',
          height: '100%',
        }}
      />
    )}
  </Flex>
);

export default LeftArrow;

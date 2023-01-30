import React from 'react';

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

// eslint-disable-next-line import/no-named-as-default
import SelectTeam from '@/components/CreateBoard/SplitBoard/SubTeamsTab/SelectTeam';
import FakeMainBoardCard from '../MainBoardCard';
import { StyledBox } from './styles';

const FakeTeamTab: React.FC = () => (
  <Flex css={{ mt: '$32' }} direction="column">
    <Flex css={{ width: '100%' }} gap="22" justify="between">
      <SelectTeam />
      <StyledBox
        css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
        direction="column"
        elevation="1"
        gap="2"
      >
        <Text color="primary300" size="xs">
          Stakeholders
        </Text>
        <Text css={{ wordBreak: 'break-word' }} size="md" />
      </StyledBox>
    </Flex>
    <Flex justify="end">
      <Flex
        align="center"
        gap="8"
        justify="end"
        css={{
          color: '$primary200',
          py: '$14',
          cursor: 'pointer',
          transition: 'text-decoration 0.2s ease-in-out',
          '&:hover': {
            '&>span': {
              textDecoration: 'underline',
            },
          },
        }}
      >
        <Icon
          name="edit"
          css={{
            width: '$16',
            height: '$16',
            color: '$primary200',
          }}
        />
        <Text size="sm" fontWeight="medium" color="primary200">
          Quick edit sub-teams configurations
        </Text>
      </Flex>
    </Flex>
    <FakeMainBoardCard />
  </Flex>
);

export default FakeTeamTab;

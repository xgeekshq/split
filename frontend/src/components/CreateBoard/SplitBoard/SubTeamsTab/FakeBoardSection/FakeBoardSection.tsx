import React from 'react';

import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';

import FakeAvatarGroup from './FakeAvatarGroup/FakeAvatarGroup';
import { StyledMainBoardItem } from '../CreateMainBoardItem/styles';
import { StyledBoardItem } from '../CreateBoardItem/styles';

const FakeBoardSection = () => (
  <Flex css={{ width: '100%', height: '100%' }} direction="column" gap="8">
    <StyledMainBoardItem align="center" elevation="1" justify="between" css={{ opacity: '0.5' }}>
      <Flex align="center" gap="8" css={{ flex: 2 }}>
        <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
          <div>
            <Icon size={32} name="blob-split" />
          </div>
        </Tooltip>
        <Text heading="6">Main Board -</Text>
      </Flex>
      <Flex css={{ flex: 2 }} gap={12}>
        <Flex align="center" gap={8}>
          <Text color="primary300" size="sm">
            Sub-teams/-boards
          </Text>
          <Separator orientation="vertical" size="md" />
          <Text>2</Text>
        </Flex>
        <Flex gap="4">
          <Flex
            align="center"
            justify="center"
            css={{
              width: '$24',
              height: '$24',
              borderRadius: '$round',
              border: `1px solid $primary200`,
              color: '$primary200',
            }}
          >
            <Icon name="minus" size={12} />
          </Flex>
          <Flex
            align="center"
            justify="center"
            css={{
              width: '$24',
              height: '$24',
              borderRadius: '$round',
              border: `1px solid $primary200`,
              color: '$primary200',
            }}
          >
            <Icon name="plus" size={12} />
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" justify="end" gap="8" css={{ flex: 3 }}>
        <Text size="sm" fontWeight="medium">
          -----
        </Text>
        <FakeAvatarGroup />
      </Flex>
    </StyledMainBoardItem>
    <Flex css={{ mb: '$50' }} direction="column" gap="8">
      <Flex>
        <LeftArrow index={0} isDashboard={false} />
        <StyledBoardItem align="center" elevation="1" justify="between" css={{ opacity: '0.5' }}>
          <Flex css={{ flex: 1 }}>
            <Text heading="5">Sub-team board 1</Text>
          </Flex>
          <Flex align="center" css={{ flex: 2 }}>
            <Flex align="center" gap={8}>
              <Text>Responsible Lottery</Text>
              <Separator orientation="vertical" size="md" />
              <Flex
                align="center"
                justify="center"
                css={{
                  height: '$24',
                  width: '$24',
                  borderRadius: '$round',
                  border: '1px solid $colors$primary400',
                }}
              >
                <Icon name="wand" size={12} />
              </Flex>
              <Text color="primary300" size="sm">
                -----
              </Text>
              <Avatar
                css={{ position: 'relative' }}
                fallbackText="-"
                size={32}
                colors={{
                  bg: highlight2Colors.highlight2Lighter,
                  fontColor: highlight2Colors.highlight2Dark,
                }}
              />
            </Flex>
          </Flex>
          <Flex align="center" justify="end" gap="8" css={{ flex: 3 }}>
            <Text size="sm">-----</Text>
            <FakeAvatarGroup />
          </Flex>
        </StyledBoardItem>
      </Flex>
      <Flex>
        <LeftArrow index={1} isDashboard={false} />
        <StyledBoardItem align="center" elevation="1" justify="between" css={{ opacity: '0.5' }}>
          <Flex css={{ flex: 1 }}>
            <Text heading="5">Sub-team board 2</Text>
          </Flex>
          <Flex align="center" css={{ flex: 2 }}>
            <Flex align="center" gap={8}>
              <Text>Responsible Lottery</Text>
              <Separator orientation="vertical" size="md" />
              <Flex
                align="center"
                justify="center"
                css={{
                  height: '$24',
                  width: '$24',
                  borderRadius: '$round',
                  border: '1px solid $colors$primary400',
                }}
              >
                <Icon name="wand" size={12} />
              </Flex>
              <Text color="primary300" size="sm">
                -----
              </Text>
              <Avatar
                css={{ position: 'relative' }}
                fallbackText="-"
                size={32}
                colors={{
                  bg: highlight2Colors.highlight2Lighter,
                  fontColor: highlight2Colors.highlight2Dark,
                }}
              />
            </Flex>
          </Flex>
          <Flex align="center" justify="end" gap="8" css={{ flex: 3 }}>
            <Text size="sm">-----</Text>
            <FakeAvatarGroup />
          </Flex>
        </StyledBoardItem>
      </Flex>
    </Flex>
    <Tooltip color="primary800" content="First select a team">
      <Flex css={{ width: 'fit-content' }}>
        <Checkbox id="slack" label="Create Slack group for each sub-team" size="md" disabled />
      </Flex>
    </Tooltip>
  </Flex>
);

export default FakeBoardSection;

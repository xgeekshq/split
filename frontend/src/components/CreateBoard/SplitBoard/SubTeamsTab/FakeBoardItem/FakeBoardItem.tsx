import React from 'react';

import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import FakeAvatarGroup from '@/components/CreateBoard/SplitBoard/SubTeamsTab/FakeBoardItem/FakeAvatarGroup/FakeAvatarGroup';
import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';
import { InnerContainer } from '@styles/pages/pages.styles';

const FakeBoardItem = () => (
  <Flex css={{ width: '100%', height: '100%' }} direction="column" gap={8}>
    <InnerContainer align="center" css={{ opacity: '0.5' }} elevation="1" justify="between">
      <Flex align="center" css={{ flex: 2 }} gap={8}>
        <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
          <div>
            <Icon name="blob-split" size={32} />
          </div>
        </Tooltip>
        <Text heading="6">Main Board -</Text>
      </Flex>
      <Flex align="center" css={{ flex: 2 }} gap={12}>
        <Flex align="center" gap={8}>
          <Text color="primary300" size="sm">
            Sub-teams/-boards
          </Text>
          <Separator orientation="vertical" size="md" />
          <Text>2</Text>
        </Flex>
        <Flex gap={4}>
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
      <Flex align="center" css={{ flex: 3 }} gap={8} justify="end">
        <Text fontWeight="medium" size="sm">
          -----
        </Text>
        <FakeAvatarGroup />
      </Flex>
    </InnerContainer>
    <Flex css={{ mb: '$50' }} direction="column" gap={8}>
      <Flex direction="column">
        <LeftArrow index={0} isDashboard={false} />
        <InnerContainer
          align="center"
          css={{ opacity: '0.5', ml: '$40' }}
          elevation="1"
          justify="between"
          size="sm"
        >
          <Flex css={{ flex: 2 }}>
            <Text heading="5">Sub-team board 1</Text>
          </Flex>
          <Flex align="center" css={{ flex: 4 }}>
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
          <Flex align="center" css={{ flex: 2 }} gap={8} justify="end">
            <Text size="sm">-----</Text>
            <FakeAvatarGroup />
          </Flex>
        </InnerContainer>
      </Flex>
      <Flex direction="column">
        <LeftArrow index={1} isDashboard={false} />
        <InnerContainer
          align="center"
          css={{ opacity: '0.5', ml: '$40' }}
          elevation="1"
          justify="between"
          size="sm"
        >
          <Flex css={{ flex: 2 }}>
            <Text heading="5">Sub-team board 2</Text>
          </Flex>
          <Flex align="center" css={{ flex: 4 }}>
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
          <Flex align="center" css={{ flex: 2 }} gap={8} justify="end">
            <Text size="sm">-----</Text>
            <FakeAvatarGroup />
          </Flex>
        </InnerContainer>
      </Flex>
    </Flex>
    <Tooltip color="primary800" content="First select a team">
      <Flex css={{ width: 'fit-content' }}>
        <Checkbox disabled id="slack" label="Create Slack group for each sub-team" size="md" />
      </Flex>
    </Tooltip>
  </Flex>
);

export default FakeBoardItem;

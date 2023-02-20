import React from 'react';

import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';

import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import Icon from '@/components/Primitives/Icon';
import Avatar from '@/components/Primitives/Avatar/Avatar';
import Checkbox from '@/components/Primitives/Checkbox';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import FakeCardAvatars from '../CardAvatars';
import { Container, MainContainer } from './styles';

const FakeMainBoardCard = () => (
  <Flex css={{ width: '100%', height: '100%' }} direction="column" gap="8">
    <MainContainer align="center" elevation="1" justify="between" css={{ opacity: '0.5' }}>
      <Flex>
        <Flex align="center" gap="8">
          <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
            <div>
              <Icon css={{ width: '31px', height: '$32' }} name="blob-split" />
            </div>
          </Tooltip>
          <Text heading="6">Main Board -</Text>
        </Flex>
        <Flex align="center" css={{ ml: '$40' }}>
          <Text color="primary300" css={{ mr: '$8' }} size="sm">
            Sub-teams/-boards
          </Text>
          <Separator orientation="vertical" size="md" />
          <Text css={{ ml: '$8' }}>2</Text>
          <Flex css={{ ml: '$12' }} gap="4">
            <Flex
              align="center"
              justify="center"
              css={{
                width: '$24',
                height: '$24',
                borderRadius: '$round',
                border: `1px solid $colors$primary200`,
                color: '$colors$primary200',
                transition: 'all 0.2s ease-in-out',

                '&:hover': {
                  cursor: 'default',
                  backgroundColor: 'white',
                },
              }}
            >
              <Icon
                name="minus"
                css={{
                  width: '$10',
                  height: '$1',
                }}
              />
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
                transition: 'all 0.2s ease-in-out',

                '&:hover': {
                  cursor: 'default',
                  backgroundColor: 'white',
                },
              }}
            >
              <Icon
                name="plus"
                css={{
                  width: '$12',
                  height: '$12',
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" gap="8">
        <Text size="sm" fontWeight="medium">
          -----
        </Text>
        <FakeCardAvatars />
      </Flex>
    </MainContainer>
    <Flex css={{ mb: '$50' }} direction="column" gap="8">
      <Flex css={{ flex: '1 1 0', width: '100%' }}>
        <LeftArrow index={0} isDashboard={false} />

        <Container
          align="center"
          elevation="1"
          justify="between"
          css={{
            backgroundColor: 'white',
            height: '$64',
            width: '100%',
            ml: '$40',
            py: '$16',
            pl: '$32',
            pr: '$24',
            opacity: '0.5',
          }}
        >
          <Flex align="center">
            <Text heading="5">Sub-team board 1</Text>
            <Flex align="center">
              <Text css={{ ml: '$40', mr: '$8' }}>Responsible Lottery</Text>
              <Separator orientation="vertical" size="md" />
              <Flex
                align="center"
                justify="center"
                css={{
                  height: '$24',
                  width: '$24',
                  borderRadius: '$round',
                  border: '1px solid $colors$primary400',
                  ml: '$12',

                  transtion: 'all 0.2s ease-in-out',
                }}
              >
                <Icon
                  name="wand"
                  css={{
                    width: '$12',
                    height: '$12',
                  }}
                />
              </Flex>
              <Text color="primary300" css={{ mx: '$8' }} size="sm">
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
          <Flex align="center" gap="8">
            <Text size="sm">-----</Text>
            <FakeCardAvatars />
          </Flex>
        </Container>
      </Flex>
      <Flex css={{ flex: '1 1 0', width: '100%' }}>
        <LeftArrow index={1} isDashboard={false} />

        <Container
          align="center"
          elevation="1"
          justify="between"
          css={{
            backgroundColor: 'white',
            height: '$64',
            width: '100%',
            ml: '$40',
            py: '$16',
            pl: '$32',
            pr: '$24',
            opacity: '0.5',
          }}
        >
          <Flex align="center">
            <Text heading="5">Sub-team board 2</Text>
            <Flex align="center">
              <Text css={{ ml: '$40', mr: '$8' }}>Responsible Lottery</Text>
              <Separator orientation="vertical" size="md" />
              <Flex
                align="center"
                justify="center"
                css={{
                  height: '$24',
                  width: '$24',
                  borderRadius: '$round',
                  border: '1px solid $colors$primary400',
                  ml: '$12',

                  transtion: 'all 0.2s ease-in-out',
                }}
              >
                <Icon
                  name="wand"
                  css={{
                    width: '$12',
                    height: '$12',
                  }}
                />
              </Flex>
              <Text color="primary300" css={{ mx: '$8' }} size="sm">
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
          <Flex align="center" gap="8">
            <Text size="sm">-----</Text>
            <FakeCardAvatars />
          </Flex>
        </Container>
      </Flex>
    </Flex>
    <Tooltip color="primary800" content="First select a team">
      <Flex css={{ width: 'fit-content' }}>
        <Checkbox id="slack" label="Create Slack group for each sub-team" size="md" disabled />
      </Flex>
    </Tooltip>
  </Flex>
);

export default FakeMainBoardCard;

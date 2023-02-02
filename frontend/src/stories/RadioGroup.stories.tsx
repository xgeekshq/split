import React from 'react';
import { ComponentStory } from '@storybook/react';

import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
  Label,
} from '@/components/Primitives/RadioGroup';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

import {
  RadioGroupDirectionType,
  RadioGroupSizeType,
  RadioGroupFontWeightType,
} from './types/PrimitiveTypes';

const DIRECTION_OPTIONS: RadioGroupDirectionType[] = ['row', 'column'];

const SIZE_OPTIONS: RadioGroupSizeType[] = ['sm', 'md', 'lg'];

const FONT_WEIGHT_OPTIONS: RadioGroupFontWeightType[] = ['regular', 'medium', 'bold'];

export default {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css', 'asChild'],
      sort: 'requiredFirst',
    },
  },
  args: {
    direction: 'column',
    size: 'sm',
    fontWeight: 'regular',
  },
  argTypes: {
    direction: {
      options: DIRECTION_OPTIONS,
      control: { type: 'select' },
      description: 'The component directions.',
      table: {
        type: { summary: DIRECTION_OPTIONS.join('|') },
        defaultValue: { summary: 'column' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 'sm' },
      },
    },
    fontWeight: {
      options: FONT_WEIGHT_OPTIONS,
      control: { type: 'select' },
      description: 'The component font weight.',
      table: {
        type: { summary: FONT_WEIGHT_OPTIONS.join('|') },
        defaultValue: { summary: 'regular' },
      },
    },
  },
};

const Template: ComponentStory<typeof RadioGroup> = ({ direction, size, fontWeight }: any) => (
  <RadioGroup direction={direction} defaultValue="default" css={{ maxWidth: '40%' }}>
    <Flex align="center">
      <RadioGroupItem value="default" id="r1">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label size={size} fontWeight={fontWeight} color="primary500" htmlFor="r1">
        Default
      </Label>
    </Flex>
    <Flex align="center">
      <RadioGroupItem value="comfortable" id="r2">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label size={size} fontWeight={fontWeight} color="primary500" htmlFor="r2">
        Comfortable
      </Label>
    </Flex>
    <Flex align="center">
      <RadioGroupItem value="compact" id="r3">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label size={size} fontWeight={fontWeight} color="primary500" htmlFor="r3">
        Compact
      </Label>
    </Flex>
  </RadioGroup>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Multiline: ComponentStory<typeof RadioGroup> = ({ direction }: any) => (
  <RadioGroup
    direction={direction}
    defaultValue="default"
    css={{ maxWidth: '50%', flexWrap: 'wrap' }}
  >
    <Flex>
      <RadioGroupItem value="default" id="r1">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label htmlFor="r1">
        <Flex direction="column">
          <Text color="primary800" fontWeight="bold" size="sm">
            Default
          </Text>
          <Text size="sm" color="primary500">
            Normal, evenly spaced content.
          </Text>
        </Flex>
      </Label>
    </Flex>
    <Flex>
      <RadioGroupItem value="comfortable" id="r2">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label htmlFor="r2">
        <Flex direction="column">
          <Text color="primary800" fontWeight="bold" size="sm">
            Comfortable
          </Text>
          <Text size="sm" color="primary500">
            Add a more roomy feel to it.
          </Text>
        </Flex>
      </Label>
    </Flex>
    <Flex>
      <RadioGroupItem value="compact" id="r3">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label htmlFor="r3">
        <Flex direction="column">
          <Text color="primary800" fontWeight="bold" size="sm">
            Compact
          </Text>
          <Text size="sm" color="primary500">
            View more content at once.
          </Text>
        </Flex>
      </Label>
    </Flex>
  </RadioGroup>
);

Multiline.args = {
  direction: 'row',
};

Multiline.argTypes = {
  size: {
    control: false,
  },
  fontWeight: {
    control: false,
  },
};

import React from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import {
  Label,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/Primitives/Inputs/RadioGroup/RadioGroup';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import {
  RadioGroupDirectionType,
  RadioGroupFontWeightType,
  RadioGroupSizeType,
} from '@/stories/types/PrimitiveTypes';

const DIRECTION_OPTIONS: RadioGroupDirectionType[] = ['row', 'column'];

const SIZE_OPTIONS: RadioGroupSizeType[] = ['sm', 'md', 'lg'];

const FONT_WEIGHT_OPTIONS: RadioGroupFontWeightType[] = ['regular', 'medium', 'bold'];

export default {
  title: 'Primitives/Inputs/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.

        **File Path:**
        \`@/components/Primitives/Inputs/RadioGroup/RadioGroup.tsx\`
        `,
      },
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
  <RadioGroup defaultValue="default" direction={direction}>
    <Flex align="center">
      <RadioGroupItem id="r1" value="default">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label color="primary500" fontWeight={fontWeight} htmlFor="r1" size={size}>
        Default
      </Label>
    </Flex>
    <Flex align="center">
      <RadioGroupItem id="r2" value="comfortable">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label color="primary500" fontWeight={fontWeight} htmlFor="r2" size={size}>
        Comfortable
      </Label>
    </Flex>
    <Flex align="center">
      <RadioGroupItem id="r3" value="compact">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label color="primary500" fontWeight={fontWeight} htmlFor="r3" size={size}>
        Compact
      </Label>
    </Flex>
  </RadioGroup>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Multiline: ComponentStory<typeof RadioGroup> = ({
  direction,
  size,
  fontWeight,
}: any) => (
  <RadioGroup css={{ flexWrap: 'wrap' }} defaultValue="default" direction={direction}>
    <Flex>
      <RadioGroupItem id="r4" value="default">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label htmlFor="r4">
        <Flex direction="column">
          <Text color="primary800" fontWeight={fontWeight} size={size}>
            Default
          </Text>
          <Text color="primary500" size="sm">
            Normal, evenly spaced content.
          </Text>
        </Flex>
      </Label>
    </Flex>
    <Flex>
      <RadioGroupItem id="r5" value="comfortable">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label htmlFor="r5">
        <Flex direction="column">
          <Text color="primary800" fontWeight={fontWeight} size={size}>
            Comfortable
          </Text>
          <Text color="primary500" size="sm">
            Add a more roomy feel to it.
          </Text>
        </Flex>
      </Label>
    </Flex>
    <Flex>
      <RadioGroupItem id="r6" value="compact">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <Label htmlFor="r6">
        <Flex direction="column">
          <Text color="primary800" fontWeight={fontWeight} size={size}>
            Compact
          </Text>
          <Text color="primary500" size="sm">
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

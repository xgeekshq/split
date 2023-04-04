import React from 'react';
import { ComponentStory } from '@storybook/react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Button from '@/components/Primitives/Inputs/Button/Button';
import dedent from 'ts-dedent';
import {
  DirectionType,
  AlignType,
  JustifyType,
  WrapType,
  GapType,
} from '@/stories/types/PrimitiveTypes';

const DIRECTION_OPTIONS: DirectionType[] = ['row', 'column', 'rowReverse', 'columnReverse'];

const ALIGN_OPTIONS: AlignType[] = ['start', 'center', 'end', 'stretch', 'baseline'];

const JUSTIFY_OPTIONS: JustifyType[] = ['start', 'center', 'end', 'between', 'around', 'evenly'];

const WRAP_OPTIONS: WrapType[] = ['noWrap', 'wrap', 'wrapReverse'];

const GAP_OPTIONS: GapType[] = [2, 4, 6, 8, 10, 12, 16, 20, 22, 24, 26, 32, 36, 40];

export default {
  title: 'Primitives/Layout/Flex',
  component: Flex,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Flex element, allows you to control how the elements are displayed in the page.

        **File Path:**
        \`@/components/Primitives/Layout/Flex.tsx\`
        `,
      },
    },
  },
  args: {
    direction: 'row',
    gap: 16,
  },
  argTypes: {
    direction: {
      options: DIRECTION_OPTIONS,
      control: { type: 'select' },
      description: 'Establishes the component main-axis.',
      table: {
        type: { summary: DIRECTION_OPTIONS.join('|') },
        defaultValue: { summary: 'row' },
      },
    },
    align: {
      options: ALIGN_OPTIONS,
      control: { type: 'select' },
      description:
        'Defines the default behavior for how flex items are laid out along the cross-axis.',
      table: {
        type: { summary: ALIGN_OPTIONS.join('|') },
      },
    },
    justify: {
      options: JUSTIFY_OPTIONS,
      control: { type: 'select' },
      description: 'Defines the alignment along the main-axis.',
      table: {
        type: { summary: ALIGN_OPTIONS.join('|') },
      },
    },
    wrap: {
      options: WRAP_OPTIONS,
      control: { type: 'select' },
      description: 'Defines if items should try to fit onto one line or wrap lines.',
      table: {
        type: { summary: WRAP_OPTIONS.join('|') },
      },
    },
    gap: {
      options: GAP_OPTIONS,
      control: { type: 'select' },
      description: 'Controls the space between flex items.',
      table: {
        type: { summary: GAP_OPTIONS.join('|') },
      },
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Whether the component is clickable.',
      table: {
        type: { summary: 'boolean' },
      },
      defaultValue: false,
    },
    pointer: {
      control: { type: 'boolean' },
      description: 'Whether the component should display a pointer cursor.',
      table: {
        type: { summary: 'boolean' },
      },
      defaultValue: false,
    },
    media: {},
  },
};

const Template: ComponentStory<typeof Flex> = ({ ...args }) => (
  <Flex {...args}>
    <Button>Flex 1</Button>
    <Button>Flex 2</Button>
    <Button>Flex 3</Button>
  </Flex>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

import React from 'react';
import { ComponentStory } from '@storybook/react';

import Text from '@/components/Primitives/Text';
import {
  ColorType,
  DisplayType,
  FontWeightType,
  HeadingType,
  Overline,
  TextSizeType,
} from './types/PrimitiveTypes';

const FONT_WEIGHT_OPTIONS: FontWeightType[] = ['regular', 'medium', 'bold'];

const DISPLAY_OPTIONS: DisplayType[] = [1, 2, 3];

const HEADING_OPTIONS: HeadingType[] = [1, 2, 3, 4, 5, 6, 7];

const OVERLINE_OPTIONS: Overline[] = [1, 2];

const SIZE_OPTIONS: TextSizeType[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];

const COLOR_OPTIONS: ColorType[] = [
  'white',
  'dangerBase',
  'primary200',
  'primary300',
  'primary400',
  'primary500',
  'primary800',
];

export default {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: '', // Change main component description in docs page
      },
    },
  },
  args: {
    children: 'Lorem Ipsum',
  },
  argTypes: {
    fontWeight: {
      options: FONT_WEIGHT_OPTIONS,
      control: { type: 'select' },
      description: 'The component font weight.',
      table: {
        type: { summary: FONT_WEIGHT_OPTIONS.join('|') },
        defaultValue: { summary: 'regular' },
      },
    },
    display: {
      options: DISPLAY_OPTIONS,
      control: { type: 'select' },
      description: 'The component display.',
      table: {
        type: { summary: DISPLAY_OPTIONS.join('|') },
      },
    },
    heading: {
      options: HEADING_OPTIONS,
      control: { type: 'select' },
      description: 'The component heading.',
      table: {
        type: { summary: HEADING_OPTIONS.join('|') },
      },
    },
    overline: {
      options: OVERLINE_OPTIONS,
      control: { type: 'select' },
      description: 'The component overline.',
      table: {
        type: { summary: OVERLINE_OPTIONS.join('|') },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
      },
    },
    underline: {
      control: { type: 'boolean' },
      description: 'Underlines the component.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    label: {
      control: { type: 'boolean' },
      description: 'Transforms the component into a label.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    hint: {
      control: { type: 'boolean' },
      description: 'Transforms the component into a hint.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    color: {
      options: COLOR_OPTIONS,
      control: { type: 'select' },
      description: 'The component color.',
      table: {
        type: { summary: COLOR_OPTIONS.join('|') },
      },
    },
  },
};

const Template: ComponentStory<typeof Text> = ({ children, ...args }) => (
  <Text {...args}>{children}</Text>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

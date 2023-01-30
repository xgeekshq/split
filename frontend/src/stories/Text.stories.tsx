import React from 'react';
import { ComponentStory } from '@storybook/react';

import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
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

const DISABLE_ARG_TYPES = {
  display: {
    control: false,
  },
  fontWeight: {
    control: false,
  },
  heading: {
    control: false,
  },
  hint: {
    control: false,
  },
  label: {
    control: false,
  },
  overline: {
    control: false,
  },
  size: {
    control: false,
  },
  visible: {
    control: false,
  },
};

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
    visible: {
      control: { type: 'boolean' },
      description: 'Controls the component visibility.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
      defaultValue: true,
    },
  },
};

const Template: ComponentStory<typeof Text> = ({ children, ...args }) => (
  <Text {...args}>{children}</Text>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Displays: ComponentStory<typeof Text> = ({ color, underline }) => (
  <Flex direction="column" justify="center" align="center" gap={40} wrap="wrap">
    {DISPLAY_OPTIONS.map((display) => (
      <Text display={display} color={color} underline={underline} key={display}>
        Display {display}
      </Text>
    ))}
  </Flex>
);

export const Headings: ComponentStory<typeof Text> = ({ color, underline }) => (
  <Flex direction="column" justify="center" align="center" gap={40} wrap="wrap">
    {HEADING_OPTIONS.map((heading) => (
      <Text heading={heading} color={color} underline={underline} key={heading}>
        Heading {heading}
      </Text>
    ))}
  </Flex>
);

export const SizesAndWeights: ComponentStory<typeof Text> = ({ children, color, underline }) => (
  <Flex justify="evenly" wrap="wrap">
    {FONT_WEIGHT_OPTIONS.map((fontWeight) => (
      <Flex direction="column" justify="center" align="center" gap={20} key={fontWeight}>
        <Text heading="4">Font Weight {fontWeight}</Text>
        {SIZE_OPTIONS.map((size) => (
          <Text fontWeight={fontWeight} size={size} color={color} underline={underline} key={size}>
            {children}
          </Text>
        ))}
      </Flex>
    ))}
  </Flex>
);

export const Other: ComponentStory<typeof Text> = ({ children, underline }) => (
  <Flex justify="evenly" wrap="wrap">
    <Flex direction="column" align="center" gap={20}>
      <Text heading="4">Overline</Text>
      {OVERLINE_OPTIONS.map((overline) => (
        <Text overline={overline} underline={underline} key={overline}>
          {children}
        </Text>
      ))}
    </Flex>
    <Flex direction="column" align="center" gap={20}>
      <Text heading="4">Hint</Text>
      <Text hint underline={underline}>
        {children}
      </Text>
    </Flex>
    <Flex direction="column" align="center" gap={20}>
      <Text heading="4">Label</Text>
      <Text label underline={underline}>
        {children}
      </Text>
    </Flex>
  </Flex>
);

Displays.argTypes = {
  ...DISABLE_ARG_TYPES,
  children: {
    control: false,
  },
};

Headings.argTypes = {
  ...DISABLE_ARG_TYPES,
  children: {
    control: false,
  },
};

SizesAndWeights.argTypes = DISABLE_ARG_TYPES;

Other.argTypes = DISABLE_ARG_TYPES;

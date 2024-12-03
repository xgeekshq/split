import React from 'react';
import { ArgTypes, StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import {
  ColorType,
  DisplayType,
  FontWeightType,
  HeadingType,
  OverflowType,
  Overline,
  TextSizeType,
} from '@/stories/types/PrimitiveTypes';

const FONT_WEIGHT_OPTIONS: FontWeightType[] = ['regular', 'medium', 'bold'];
const DISPLAY_OPTIONS: DisplayType[] = [1, 2, 3];
const HEADING_OPTIONS: HeadingType[] = [1, 2, 3, 4, 5, 6, 7];
const OVERLINE_OPTIONS: Overline[] = [1, 2];
const SIZE_OPTIONS: TextSizeType[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];
const COLOR_OPTIONS: ColorType[] = [
  'white',
  'dangerBase',
  'primary100',
  'primary200',
  'primary300',
  'primary400',
  'primary500',
  'primary800',
];
const OVERFLOW_OPTIONS: OverflowType[] = ['wrap'];

const DISABLE_ARG_TYPES: Partial<ArgTypes> = {
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
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Primitives/Text/Text.tsx\`
        `,
      },
    },
  },
  args: {
    children: 'Lorem Ipsum',
  },
  argTypes: {
    children: {
      description: 'Text content.',
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
    ellipsis: {
      control: { type: 'boolean' },
      description: 'When true will display an ellipsis to represent clipped text.',
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
    link: {
      control: { type: 'boolean' },
      description: 'When true will display text decoration on hover.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    overflow: {
      options: OVERFLOW_OPTIONS,
      control: { type: 'select' },
      description: 'Controls the component overflow.',
      table: {
        type: { summary: OVERFLOW_OPTIONS.join('|') },
      },
    },
  },
};

const Template: StoryFn<typeof Text> = ({ children, ...args }) => <Text {...args}>{children}</Text>;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Displays: StoryFn<typeof Text> = ({ color, underline }) => (
  <Flex align="center" direction="column" gap={40} justify="center" wrap="wrap">
    {DISPLAY_OPTIONS.map((display) => (
      <Text key={display} color={color} display={display} underline={underline}>
        Display {display}
      </Text>
    ))}
  </Flex>
);

export const Headings: StoryFn<typeof Text> = ({ color, underline }) => (
  <Flex align="center" direction="column" gap={40} justify="center" wrap="wrap">
    {HEADING_OPTIONS.map((heading) => (
      <Text key={heading} color={color} heading={heading} underline={underline}>
        Heading {heading}
      </Text>
    ))}
  </Flex>
);

export const SizesAndWeights: StoryFn<typeof Text> = ({ children, color, underline }) => (
  <Flex gap="32" justify="evenly" wrap="wrap">
    {FONT_WEIGHT_OPTIONS.map((fontWeight) => (
      <Flex key={fontWeight} align="center" direction="column" gap={20} justify="center">
        <Text heading="4">Font Weight {fontWeight}</Text>
        {SIZE_OPTIONS.map((size) => (
          <Text key={size} color={color} fontWeight={fontWeight} size={size} underline={underline}>
            {children}
          </Text>
        ))}
      </Flex>
    ))}
  </Flex>
);

export const Other: StoryFn<typeof Text> = ({ children, underline }) => (
  <Flex gap="32" justify="evenly" wrap="wrap">
    <Flex align="center" direction="column" gap={20}>
      <Text heading="4">Overline</Text>
      {OVERLINE_OPTIONS.map((overline) => (
        <Text key={overline} overline={overline} underline={underline}>
          {children}
        </Text>
      ))}
    </Flex>
    <Flex align="center" direction="column" gap={20}>
      <Text heading="4">Hint</Text>
      <Text hint underline={underline}>
        {children}
      </Text>
    </Flex>
    <Flex align="center" direction="column" gap={20}>
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

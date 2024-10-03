import React from 'react';
import { ArgTypes, StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { BoxVariantType, ElevationType } from '@/stories/types/PrimitiveTypes';
import { capitalize } from '@/stories/utils';

const ELEVATION_OPTIONS: ElevationType[] = [0, 1, 2, 3, 4];
const VARIANT_OPTIONS: BoxVariantType[] = ['bordered', 'dropdown'];

const DISABLE_ARG_TYPES: Partial<ArgTypes> = {
  elevation: {
    control: false,
  },
  variant: {
    control: false,
  },
};

export default {
  title: 'Primitives/Layout/Box',
  component: Box,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Primitives/Layout/Box/Box.tsx\`
        `,
      },
    },
  },
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  argTypes: {
    elevation: {
      options: ELEVATION_OPTIONS,
      control: { type: 'select' },
      description: 'The elevation of the component. It changes the shadow of the component.',
      table: {
        type: { summary: ELEVATION_OPTIONS.join('|') },
      },
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: 'select' },
      description: 'The component variations.',
      table: {
        type: { summary: VARIANT_OPTIONS.join('|') },
      },
    },
    children: {
      description: 'Contains content to be rendered inside the box.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

const Template: StoryFn<typeof Box> = ({ children, ...args }) => <Box {...args}>{children}</Box>;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Elevations: StoryFn<typeof Box> = ({ children, ...args }) => (
  <Flex direction="column" gap={20}>
    {ELEVATION_OPTIONS.map((elevation) => (
      <Flex key={elevation} direction="column" gap={8}>
        <Text heading="4">Elevation {elevation}</Text>
        <Box elevation={elevation} {...args}>
          {children}
        </Box>
      </Flex>
    ))}
  </Flex>
);

export const Variants: StoryFn<typeof Box> = ({ children, ...args }) => (
  <Flex direction="column" gap={20}>
    {VARIANT_OPTIONS.map((variant) => (
      <Flex key={variant} direction="column" gap={8}>
        <Text heading="4">{capitalize(variant)} variant</Text>
        <Box variant={variant} {...args}>
          {children}
        </Box>
      </Flex>
    ))}
  </Flex>
);

Elevations.argTypes = DISABLE_ARG_TYPES;
Variants.argTypes = DISABLE_ARG_TYPES;

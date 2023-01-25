import React from 'react';
import { ComponentStory } from '@storybook/react';

import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import { ElevationType, BoxVariantType } from './types/PrimitiveTypes';
import { capitalize } from './utils';

const ELEVATION_OPTIONS: ElevationType[] = [0, 1, 2, 3, 4];
const VARIANT_OPTIONS: BoxVariantType[] = ['bordered', 'dropdown'];

export default {
  title: 'Primitives/Box',
  component: Box,
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
  },
};

const Template: ComponentStory<typeof Box> = ({ children, ...args }) => (
  <Box {...args}>{children}</Box>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Elevations: ComponentStory<typeof Box> = ({ children, ...args }) => (
  <Flex direction="column" gap={8}>
    {ELEVATION_OPTIONS.map((elevation) => (
      <div key={elevation}>
        <h4>Elevation {elevation}</h4>
        <Box elevation={elevation} {...args}>
          {children}
        </Box>
      </div>
    ))}
  </Flex>
);

Elevations.argTypes = {
  elevation: {
    control: false,
  },
  variant: {
    control: false,
  },
};

export const Variants: ComponentStory<typeof Box> = ({ children, ...args }) => (
  <Flex direction="column" gap={8}>
    {VARIANT_OPTIONS.map((variant) => (
      <div key={variant}>
        <h4>{capitalize(variant)} variant</h4>
        <Box variant={variant} {...args}>
          {children}
        </Box>
      </div>
    ))}
  </Flex>
);

Variants.argTypes = {
  elevation: {
    control: false,
  },
  variant: {
    control: false,
  },
};

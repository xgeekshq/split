import React from 'react';
import { ComponentStory } from '@storybook/react';

import Box from '@/components/Primitives/Box';

type ElevationType = 0 | 1 | 2 | 3 | 4;
type VariantType = 'bordered' | 'dropdown';

const ELEVATION_OPTIONS: ElevationType[] = [0, 1, 2, 3, 4];
const VARIANT_OPTIONS: VariantType[] = ['bordered', 'dropdown'];

export default {
  title: 'Primitives/Box',
  component: Box,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
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
        defaultValue: { summary: 'undefined' },
      },
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: 'select' },
      description: 'The component variations.',
      table: {
        type: { summary: VARIANT_OPTIONS.join('|') },
        defaultValue: { summary: 'undefined' },
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
  <>
    {ELEVATION_OPTIONS.map((elevation) => (
      <div style={{ marginBottom: '2rem' }} key={elevation}>
        <h4>Elevation {elevation}</h4>
        <Box elevation={elevation} {...args}>
          {children}
        </Box>
      </div>
    ))}
  </>
);

export const Variants: ComponentStory<typeof Box> = ({ children, ...args }) => (
  <>
    {VARIANT_OPTIONS.map((variant) => (
      <div style={{ marginBottom: '2rem' }} key={variant}>
        <h4>{variant.charAt(0).toUpperCase() + variant.slice(1)} variant</h4>
        <Box variant={variant} {...args}>
          {children}
        </Box>
      </div>
    ))}
  </>
);

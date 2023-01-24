import React from 'react';
import { ComponentStory } from '@storybook/react';

import Button from '@/components/Primitives/Button';

type VariantType =
  | 'primary'
  | 'primaryOutline'
  | 'light'
  | 'lightOutline'
  | 'danger'
  | 'dangerOutline';

type SizeType = 'sm' | 'md' | 'lg';

const VARIANT_OPTIONS: VariantType[] = [
  'primary',
  'primaryOutline',
  'light',
  'lightOutline',
  'danger',
  'dangerOutline',
];

const SIZE_OPTIONS: SizeType[] = ['sm', 'md', 'lg'];

export default {
  title: 'Primitives/Button',
  component: Button,
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
    children: 'Lorem',
  },
  argTypes: {
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: 'select' },
      description: 'The component variations.',
      table: {
        type: { summary: VARIANT_OPTIONS.join('|') },
        defaultValue: { summary: 'primary' },
      },
    },
    isIcon: {
      options: 'boolean',
      control: { type: 'boolean' },
      description: 'Whether the component is an icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    textSize: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component text size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 'md' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 'md' },
      },
    },
  },
};

const Template: ComponentStory<typeof Button> = ({ children, ...args }) => (
  <Button {...args}>{children}</Button>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Variants: ComponentStory<typeof Button> = ({ children, ...args }) => (
  <div
    style={{
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: `repeat(${VARIANT_OPTIONS.length}, 1fr)`,
      justifyItems: 'center',
    }}
  >
    {VARIANT_OPTIONS.map((variant) => (
      <div key={variant} style={{ textAlign: 'center' }}>
        <h4>Variant {variant}</h4>
        {SIZE_OPTIONS.map((size) => (
          <div
            style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
            key={size}
          >
            <Button variant={variant} size={size} {...args}>
              {children}
            </Button>
          </div>
        ))}
      </div>
    ))}
  </div>
);

Variants.argTypes = {
  variant: {
    control: false,
  },
  isIcon: {
    control: false,
  },
  textSize: {
    control: false,
  },
  size: {
    control: false,
  },
};

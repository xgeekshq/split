import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Button from '@/components/Primitives/Button/Button';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text';
import {
  ButtonVariantType,
  ButtonSizeType,
  ButtonVariant,
  ButtonSize,
} from '../types/PrimitiveTypes';

const VARIANT_OPTIONS: ButtonVariantType[] = [...ButtonVariant];
const SIZE_OPTIONS: ButtonSizeType[] = [...ButtonSize];

export default {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Interactive element activated by a user. Once activated, it then performs an action.

        **File Path:**
        \`@/components/Primitives/Button.tsx\`
        `,
      },
    },
  },
  args: {
    children: 'Lorem',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    children: {
      control: { type: 'string' },
      description: 'Contains content to be rendered in the Button.',
      table: {
        type: { summary: 'React.ReactNode | string' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
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
      control: { type: 'boolean' },
      description: 'Whether the component is an icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    textSize: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component text size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
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

export const Variants: ComponentStory<typeof Button> = ({ children, disabled }) => (
  <Flex justify="evenly" wrap="wrap" gap={32}>
    {VARIANT_OPTIONS.map((variant) => (
      <Flex direction="column" justify="center" align="center" gap={16} key={variant}>
        <Text heading="5">Variant {variant}</Text>
        {SIZE_OPTIONS.map((size) => (
          <Button variant={variant} size={size} disabled={disabled} key={size}>
            {children}
          </Button>
        ))}
      </Flex>
    ))}
  </Flex>
);

export const IconButton: ComponentStory<typeof Button> = ({ children, disabled }) => (
  <Flex justify="evenly" wrap="wrap" gap={32}>
    {VARIANT_OPTIONS.map((variant) => (
      <Flex direction="column" justify="center" align="center" gap={16} key={variant}>
        <Text heading="5">Variant {variant}</Text>
        {SIZE_OPTIONS.map((size) => (
          <Button variant={variant} size={size} disabled={disabled} key={size}>
            <Icon name="plus" />
            {children}
          </Button>
        ))}
      </Flex>
    ))}
  </Flex>
);

export const Icons: ComponentStory<typeof Button> = ({ disabled }) => (
  <Flex justify="evenly" wrap="wrap" gap={32}>
    {SIZE_OPTIONS.map((size) => (
      <Flex direction="column" justify="start" align="center" gap={16} key={size}>
        <Text heading="5">Size {size}</Text>
        <Button isIcon size={size} disabled={disabled}>
          <Icon name="close" />
        </Button>
      </Flex>
    ))}
  </Flex>
);

const DISABLE_ARG_TYPES = {
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

Variants.argTypes = DISABLE_ARG_TYPES;
IconButton.argTypes = DISABLE_ARG_TYPES;
Icons.argTypes = {
  ...DISABLE_ARG_TYPES,
  children: {
    control: false,
  },
};

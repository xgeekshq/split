import React from 'react';
import { ComponentStory } from '@storybook/react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverItem,
  PopoverClose,
} from '@/components/Primitives/Popover';
import Icon from '@/components/icons/Icon';
import Text from '@/components/Primitives/Text';
import { PopoverVariantType, PopoverSizeType } from './types/PrimitiveTypes';

const VARIANT_OPTIONS: PopoverVariantType[] = ['dark', 'light'];

const SIZE_OPTIONS: PopoverSizeType[] = ['sm', 'md'];

export default {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
  },
  args: {
    variant: 'dark',
    size: 'md',
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the popover trigger.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    active: {
      control: { type: 'boolean' },
      description: "Maintain item's state as active",
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
  },
};

const Template: ComponentStory<typeof Popover> = ({ variant, size, disabled, active }: any) => (
  <>
    <Popover>
      <PopoverTrigger variant={variant} size={size} disabled={disabled}>
        <Icon name="menu-dots" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverClose>
          <PopoverItem>
            <Icon name="sort_desc" />
            <Text size="sm">Sort (desc)</Text>
          </PopoverItem>
        </PopoverClose>
        <PopoverClose>
          <PopoverItem>
            <Icon name="sort_asc" />
            <Text size="sm">Sort (asc)</Text>
          </PopoverItem>
        </PopoverClose>
        <PopoverClose>
          <PopoverItem active={active}>
            <Icon name="sort" />
            <Text size="sm">No sorting</Text>
          </PopoverItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  </>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

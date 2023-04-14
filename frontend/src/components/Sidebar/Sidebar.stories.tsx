import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import SidebarContent, { SidebarContentProps } from '@/components/Sidebar/Content/Content';
import SidebarHeader, { SidebarHeaderProps } from '@/components/Sidebar/Header/Header';
import SidebarItem, { SidebarItemProps } from '@/components/Sidebar/Item/Item';
import Sidebar from '@/components/Sidebar/Sidebar';
import { UserFactory } from '@/utils/factories/user';

const user = UserFactory.create();

export default {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
  args: {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    strategy: 'local',
  },
  argTypes: {
    firstName: {
      type: { required: true, name: 'string' },
      description: 'First name of the logged in user.',
      table: {
        type: { summary: 'string' },
      },
    },
    lastName: {
      type: { required: true, name: 'string' },
      description: 'Last name of the logged in user.',
      table: {
        type: { summary: 'string' },
      },
    },
    email: {
      type: { required: true, name: 'string' },
      description: 'Email of the logged in user.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} as Meta<typeof Sidebar>;

type Template = StoryObj<typeof Sidebar>;

export const Default: Template = {};
Default.storyName = 'Basic Usage';

export const Header = ({ firstName, lastName, email }: SidebarHeaderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Flex css={{ backgroundColor: '$primary800' }}>
      <SidebarHeader
        email={email}
        firstName={firstName}
        handleCollapse={setIsCollapsed}
        isCollapsed={isCollapsed}
        lastName={lastName}
      />
    </Flex>
  );
};

Header.parameters = {
  controls: {
    exclude: ['strategy'],
  },
};

export const Content = ({ strategy }: SidebarContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Flex css={{ backgroundColor: '$primary800', width: '256px' }} direction="column">
      <SidebarContent
        handleCollapse={setIsCollapsed}
        isCollapsed={isCollapsed}
        strategy={strategy}
      />
    </Flex>
  );
};

Content.parameters = {
  controls: {
    exclude: ['email', 'firstName', 'lastName'],
  },
};

Content.args = {
  strategy: 'local',
};

export const Item = ({ disabled, link, iconName, label, active }: SidebarItemProps) => (
  <Flex css={{ backgroundColor: '$primary800', width: '256px' }} direction="column">
    <SidebarItem
      active={active}
      disabled={disabled}
      iconName={iconName}
      label={label}
      link={link}
    />
  </Flex>
);

Item.parameters = {
  controls: {
    exclude: ['email', 'firstName', 'lastName', 'strategy'],
  },
};

Item.args = {
  disabled: false,
  link: '#',
  iconName: 'user',
  label: 'Users',
  active: 'sidebar',
};

Item.argTypes = {
  iconName: {
    type: { required: true, name: 'string' },
    description: 'Name of the icon to be displayed.',
    table: {
      type: { summary: 'string' },
    },
  },
  label: {
    type: { required: true, name: 'string' },
    description: 'Text to be displayed.',
    table: {
      type: { summary: 'string' },
    },
  },
  link: {
    description: 'Url path that the item will redirect to.',
    table: {
      type: { summary: 'string' },
    },
  },
  active: {
    description: 'Currently active url path.',
    table: {
      type: { summary: 'string' },
    },
  },
  disabled: {
    description: 'Disable the component.',
    table: {
      type: { summary: 'string' },
    },
  },
};

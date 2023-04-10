import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Sidebar from '@/components/Sidebar/Sidebar';
import SidebarHeader, { SidebarHeaderProps } from '@/components/Sidebar/Header/Header';
import SidebarContent, { SidebarContentProps } from '@/components/Sidebar/Content/Content';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import SidebarItem, { SidebarItemProps } from '@/components/Sidebar/Item/Item';
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
        firstName={firstName}
        lastName={lastName}
        email={email}
        isCollapsed={isCollapsed}
        handleCollapse={setIsCollapsed}
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
    <Flex direction="column" css={{ backgroundColor: '$primary800', width: '256px' }}>
      <SidebarContent
        strategy={strategy}
        isCollapsed={isCollapsed}
        handleCollapse={setIsCollapsed}
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
  <Flex direction="column" css={{ backgroundColor: '$primary800', width: '256px' }}>
    <SidebarItem
      disabled={disabled}
      link={link}
      iconName={iconName}
      label={label}
      active={active}
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

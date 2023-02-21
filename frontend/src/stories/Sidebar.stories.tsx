import React from 'react';
import { ComponentStory } from '@storybook/react';
import { Sidebar } from '@/components/Sidebar';
import SidebarHeader from '@/components/Sidebar/partials/Header';
import SidebarContent from '@/components/Sidebar/partials/Content';
import Flex from '@/components/Primitives/Flex';
import SidebarItem from '@/components/Sidebar/partials/Item';

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
    firstName: 'Guido',
    lastName: 'Pereira',
    email: 'g.pereira@kigroup.de',
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
};

const Template: ComponentStory<typeof Sidebar> = ({ firstName, lastName, email, strategy }) => (
  <Sidebar firstName={firstName} lastName={lastName} email={email} strategy={strategy} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const Header: ComponentStory<typeof SidebarHeader> = ({ firstName, lastName, email }) => (
  <Flex css={{ backgroundColor: '$primary800' }}>
    <SidebarHeader firstName={firstName} lastName={lastName} email={email} />
  </Flex>
);

Header.parameters = {
  controls: {
    exclude: ['strategy'],
  },
};

export const Content: ComponentStory<typeof SidebarContent> = ({ strategy }) => (
  <Flex direction="column" css={{ backgroundColor: '$primary800', width: '256px' }}>
    <SidebarContent strategy={strategy} />
  </Flex>
);

Content.parameters = {
  controls: {
    exclude: ['email', 'firstName', 'lastName'],
  },
};

Content.args = {
  strategy: 'local',
};

export const Item: ComponentStory<typeof SidebarItem> = ({
  disabled,
  link,
  iconName,
  label,
  active,
}) => (
  <Flex css={{ backgroundColor: '$primary800', width: '256px' }}>
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

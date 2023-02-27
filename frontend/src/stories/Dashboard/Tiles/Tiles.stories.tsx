import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';
import Tiles from '@/components/Dashboard/Tiles';

export default {
  title: 'Dashboard/Tiles/Tiles',
  component: Tiles,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Dashboard/Tiles/index.tsx\`
        `,
      },
    },
  },
  args: {
    data: {
      boardsCount: 99,
      usersCount: 99,
      teamsCount: 99,
    },
  },
  argTypes: {
    data: {
      description: 'Data to be displayed in the different tiles.',
      table: {
        type: { summary: '{ boardsCount: number, usersCount: number, teamsCount: number }' },
      },
    },
  },
};

const Template: ComponentStory<typeof Tiles> = ({ ...args }) => (
  <div style={{ width: '1000px' }}>
    <Tiles {...args} />
  </div>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

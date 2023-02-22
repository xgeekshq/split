import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';
import Tile from '@/components/Dashboard/Tiles/Tile';

export default {
  title: 'Components/Tile',
  component: Tile,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Displays rich content in a portal, triggered by a button.

        **File Path:**
        \`@/components/Dashboard/Tiles/Tile.tsx\`
        `,
      },
    },
  },
  args: {
    title: 'Tile Title',
    link: '#',
    color: 'purple',
    count: 99,
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      description: "The color of the component's blob icon.",
    },
    title: {
      description: 'The title text to be displayed.',
    },
    count: {
      description: 'The count number to be displayed.',
    },
    link: {
      description: 'Url path that the component will redirect to.',
    },
  },
};

const Template: ComponentStory<typeof Tile> = ({ ...args }) => (
  <div style={{ width: '450px' }}>
    <Tile {...args} />
  </div>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

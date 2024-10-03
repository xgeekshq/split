import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Tile from '@/components/Dashboard/Tiles/Tile/Tile';

export default {
  title: 'Dashboard/Tiles/Tile',
  component: Tile,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Dashboard/Tiles/Tile/Tile.tsx\` and \`@/components/Dashboard/Tiles/styles.tsx\`
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

const Template: StoryFn<typeof Tile> = ({ ...args }) => (
  <div style={{ width: '450px' }}>
    <Tile {...args} />
  </div>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

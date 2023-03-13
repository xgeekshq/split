import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';

export default {
  title: 'Layouts/MainPageHeader',
  component: MainPageHeader,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/layouts/Layout/MainPageHeader/MainPageHeader.tsx\`
        `,
      },
    },
  },
  args: {
    title: 'Boards',
  },
  argTypes: {
    title: {
      description: 'The title text to be displayed.',
    },
    button: {
      description: 'Data of the button to be displayed.',
    },
  },
};

const Template: ComponentStory<typeof MainPageHeader> = ({ ...args }) => (
  <MainPageHeader {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const WithButton: ComponentStory<typeof MainPageHeader> = ({ ...args }) => (
  <div style={{ width: '50vw' }}>
    <MainPageHeader {...args} />
  </div>
);

WithButton.args = {
  button: {
    link: '#',
    label: 'Add new board',
  },
};

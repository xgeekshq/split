import Sprite from '@/components/icons/Sprite';
import { RecoilRoot } from 'recoil';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // layout: 'centered',
  backgrounds: {
    default: 'split',
    values: [
      {
        name: 'split',
        value: '#F4F7F8'
      }
    ]
  }
};

export const decorators = [
  (Story) => (
    <>
      <Sprite />
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    </>
  ),
];

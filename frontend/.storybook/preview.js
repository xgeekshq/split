import Sprite from '@/components/icons/Sprite';
import { RecoilRoot } from 'recoil';

import { mockAuthPreviewToolbarItem, withMockAuth } from '@tomfreudenberg/next-auth-mock/storybook';
import { previewMockAuthStates } from '@tomfreudenberg/next-auth-mock/storybook/preview-mock-auth-states';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true,
    exclude: ['ref', 'as', 'css', 'asChild', 'media'],
    sort: 'requiredFirst',
  },
  layout: 'centered',
  backgrounds: {
    default: 'split',
    values: [
      {
        name: 'split',
        value: '#F4F7F8',
      },
    ],
  },
};

export const globalTypes = {
  ...mockAuthPreviewToolbarItem({
    description: 'Select Session',
    defaultValue: null,
    icon: 'user',
    items: previewMockAuthStates
  })
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
  withMockAuth
];

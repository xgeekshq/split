import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import _ from '@/mocks/server';

import Sprite from '@/components/icons/Sprite';
import { RecoilRoot } from 'recoil';

import { mockAuthPreviewToolbarItem, withMockAuth } from '@tomfreudenberg/next-auth-mock/storybook';
import { previewMockAuthStates } from '@tomfreudenberg/next-auth-mock/storybook/preview-mock-auth-states';
import { sadmin } from './previewMockAuthStates';

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
    defaultValue: 'sadmin',
    icon: 'user',
    items: previewMockAuthStates,
  }),
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      suspense: false,
    },
  },
});

export const decorators = [
  (Story) => (
    <>
      <Sprite />
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Story />
        </RecoilRoot>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  ),
  withMockAuth,
];

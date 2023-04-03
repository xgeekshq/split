// TODO: Test Tab Change

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import Flex from '../Layout/Flex/Flex';
import Tab, { TabProps } from './Tab';

const DUMMY_TABS = [
  {
    value: 'tab1',
    label: 'Tab 1',
    content: <Flex>Tab 1 Content</Flex>,
  },
  {
    value: 'tab2',
    label: 'Tab 2',
    content: <Flex>Tab 2 Content</Flex>,
  },
];

const render = (props: Partial<TabProps> = {}) =>
  renderWithProviders(<Tab tabList={DUMMY_TABS} {...props} />);

describe('Components/Primitives/Tab', () => {
  it('should render correctly', () => {
    // Act
    const { getByRole, getByText } = render();

    // Assert
    expect(getByRole('tablist').children).toHaveLength(DUMMY_TABS.length);

    DUMMY_TABS.forEach((tab) => {
      expect(getByText(tab.label)).toBeInTheDocument();
    });
  });
});

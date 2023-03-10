// TODO: Test Tab Change

import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import Flex from './Layout/Flex';
import Tab, { TabProps } from './Tab';

const render = (props: TabProps) => renderWithProviders(<Tab {...props} />);

describe('Components/Primitives/Switch', () => {
  it('should render correctly', () => {
    // Arrange
    const tabProps: TabProps = {
      tabList: [
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
      ],
    };

    // Act
    const { getByRole, getByText } = render(tabProps);

    // Assert
    expect(getByRole('tablist').children).toHaveLength(tabProps.tabList.length);

    tabProps.tabList.forEach((tab) => {
      expect(getByText(tab.label)).toBeInTheDocument();
    });
  });
});

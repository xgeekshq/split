import { render as rtlRender } from '@testing-library/react';
import Item, { SidebarItemType } from './Item';

const DEFAULT_PROPS = { iconName: 'user', label: 'Users' };
const render = (props: SidebarItemType = DEFAULT_PROPS) => rtlRender(<Item {...props} />);

describe('Components/Sidebar', () => {
  test('should render', () => {
    // Arrange
    const itemProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getByTestId } = render(itemProps);
    const svgIcon = getByTestId('sidebarItem').querySelector('svg > use');

    // Assert
    expect(svgIcon).toHaveAttribute('href', `#${itemProps.iconName}`);
    expect(getByText(itemProps.label)).toBeInTheDocument();
  });
});

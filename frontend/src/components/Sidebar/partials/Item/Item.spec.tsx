import { RouterContext } from 'next/dist/shared/lib/router-context';
import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import { createMockRouter } from '@/utils/testing/mocks';
import { BOARDS_ROUTE } from '@/utils/routes';
import Item, { SidebarItemProps } from './Item';

const DEFAULT_PROPS = { iconName: 'user', label: 'Users' };
const router = createMockRouter({});
const render = (props: SidebarItemProps = DEFAULT_PROPS) =>
  rtlRender(
    <RouterContext.Provider value={router}>
      <Item {...props} />
    </RouterContext.Provider>,
  );

describe('Components/Sidebar/Item', () => {
  it('should render correctly', () => {
    // Arrange
    const itemProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getByTestId } = render(itemProps);
    const svgIcon = getByTestId('sidebarItem').querySelector('svg > use');

    // Assert
    expect(svgIcon).toHaveAttribute('href', `#${itemProps.iconName}`);
    expect(getByText(itemProps.label)).toBeInTheDocument();
  });

  it('should redirect correctly', async () => {
    // Arrange
    const itemProps = { ...DEFAULT_PROPS, link: BOARDS_ROUTE };

    // Act
    const { getByTestId } = render(itemProps);
    fireEvent.click(getByTestId('sidebarItem'));

    // Assert
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(BOARDS_ROUTE, BOARDS_ROUTE, expect.anything());
    });
  });
});

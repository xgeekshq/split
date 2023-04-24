import { fireEvent, waitFor } from '@testing-library/react';

import Item, { SidebarItemProps } from '@/components/Sidebar/Item/Item';
import { BOARDS_ROUTE } from '@/constants/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const DEFAULT_PROPS = { iconName: 'user', label: 'Users' };

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });

const render = (props: SidebarItemProps = DEFAULT_PROPS) =>
  renderWithProviders(<Item {...props} />, { routerOptions: mockRouter });

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
      expect(mockRouter.push).toHaveBeenCalledWith(BOARDS_ROUTE, BOARDS_ROUTE, expect.anything());
    });
  });

  it('should handle onClick events', () => {
    // Arrange
    const mockOnClick = jest.fn();
    const contentProps = { ...DEFAULT_PROPS, onClick: mockOnClick };

    // Act
    const { getByTestId } = render(contentProps);
    fireEvent.click(getByTestId('sidebarItem'));

    // Assert
    expect(mockOnClick).toBeCalled();
  });
});

import { fireEvent, waitFor } from '@testing-library/react';
import { createMockRouter } from '@/utils/testing/mocks';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import Header, { SidebarHeaderProps } from './Header';

const DEFAULT_PROPS = { firstName: 'First', lastName: 'Last', email: 'first.last@mail.com' };

const router = createMockRouter({});
const render = (props: SidebarHeaderProps = DEFAULT_PROPS) =>
  renderWithProviders(<Header {...props} />, { routerOptions: router });

describe('Components/Sidebar/Header', () => {
  it('should render correctly', () => {
    // Arrange
    const headerProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getByTestId } = render(headerProps);
    const userIcon = getByTestId('sidebarHeader').querySelector('svg > use');

    // Assert
    expect(getByText(`${headerProps.firstName} ${headerProps.lastName}`)).toBeInTheDocument();
    expect(getByText(headerProps.email)).toBeInTheDocument();
    expect(getByTestId('splitLogo')).toBeInTheDocument();
    expect(userIcon).toHaveAttribute('href', `#userIcon`);
    expect(
      getByText(
        headerProps.firstName.charAt(0).toUpperCase() +
          headerProps.lastName.charAt(0).toUpperCase(),
      ),
    );
  });

  it('should redirect correctly', async () => {
    // Arrange
    const headerProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId } = render(headerProps);
    const logoIcon = getByTestId('sidebarHeader').querySelectorAll('svg')[0];
    fireEvent.click(logoIcon);

    // Assert
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(DASHBOARD_ROUTE, DASHBOARD_ROUTE, expect.anything());
    });
  });
});

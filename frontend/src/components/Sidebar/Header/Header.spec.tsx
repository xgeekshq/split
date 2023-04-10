import { fireEvent, waitFor } from '@testing-library/react';
import { libraryMocks } from '@/utils/testing/mocks';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { getInitials } from '@/utils/getInitials';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import Header, { SidebarHeaderProps } from '@/components/Sidebar/Header/Header';

const DEFAULT_PROPS = { firstName: 'First', lastName: 'Last', email: 'first.last@mail.com' };

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });
const render = (props: SidebarHeaderProps = DEFAULT_PROPS) =>
  renderWithProviders(<Header {...props} />, { routerOptions: mockRouter });

describe('Components/Sidebar/Header', () => {
  it('should render correctly', () => {
    // Arrange
    const headerProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getByTestId } = render(headerProps);
    const userIcon = getByTestId('sidebarHeader').querySelector('[href="#userIcon"]');

    // Assert
    expect(getByText(`${headerProps.firstName} ${headerProps.lastName}`)).toBeInTheDocument();
    expect(getByText(headerProps.email)).toBeInTheDocument();
    expect(getByTestId('splitLogo')).toBeInTheDocument();
    expect(userIcon).toBeDefined();
    expect(getByText(getInitials(headerProps.firstName, headerProps.lastName).toUpperCase()));
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
      expect(mockRouter.push).toHaveBeenCalledWith(
        DASHBOARD_ROUTE,
        DASHBOARD_ROUTE,
        expect.anything(),
      );
    });
  });
});

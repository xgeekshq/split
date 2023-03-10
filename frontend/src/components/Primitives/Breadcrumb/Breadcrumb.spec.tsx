import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import Breadcrumb, { BreadcrumbProps } from '@/components/Primitives/Breadcrumb/Breadcrumb';
import { fireEvent, waitFor } from '@testing-library/react';
import { libraryMocks } from '@/utils/testing/mocks';
import { ROUTES } from '@/utils/routes';

const DEFAULT_PROPS: BreadcrumbProps = {
  items: [
    { title: 'Teams', link: ROUTES.Teams },
    { title: 'Current Team', isActive: true },
  ],
};

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: BreadcrumbProps) =>
  renderWithProviders(<Breadcrumb {...props} />, { routerOptions: mockRouter });

describe('Components/Primitives/Breadcrumb', () => {
  it('should render correctly', () => {
    // Arrange
    const breadcrumbProps: BreadcrumbProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId } = render(breadcrumbProps);

    // Assert
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    expect(getByTestId('breadcrumb').querySelectorAll('li')).toHaveLength(
      breadcrumbProps.items.length,
    );
  });

  it('should navigate to the link', async () => {
    // Arrange
    const breadcrumbProps: BreadcrumbProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getByText } = render(breadcrumbProps);

    // Assert
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    fireEvent.click(getByText('Teams'));

    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(ROUTES.Teams, ROUTES.Teams, expect.anything());
    });
  });
});

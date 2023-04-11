import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/react';
import Custom404 from '@/pages/404';
import { libraryMocks } from '@/utils/testing/mocks';
import { ROUTES } from '@/utils/routes';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/404' });

const render = () => renderWithProviders(<Custom404 />, { routerOptions: mockRouter });

describe('Pages/404', () => {
  it('should render correctly', () => {
    // Act
    const { getByText, getByRole } = render();
    const goHomeButton = getByRole('button');

    // Assert
    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('Page Not Found')).toBeInTheDocument();

    expect(goHomeButton).toBeInTheDocument();
    expect(goHomeButton).toHaveTextContent('Go to Home');
  });

  it('should redirect user to home page', async () => {
    // Act
    const { getByRole } = render();

    const goHomeButton = getByRole('button');
    fireEvent.click(goHomeButton);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(
        ROUTES.START_PAGE_ROUTE,
        ROUTES.START_PAGE_ROUTE,
        expect.anything(),
      );
    });
  });
});

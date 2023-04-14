import { fireEvent, waitFor } from '@testing-library/react';

import Custom500 from '@/pages/500';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/500' });

const render = () => renderWithProviders(<Custom500 />, { routerOptions: mockRouter });

describe('Pages/500', () => {
  it('should render correctly', () => {
    // Act
    const { getByText, getByRole } = render();
    const goHomeButton = getByRole('button');

    // Assert
    expect(getByText('500')).toBeInTheDocument();
    expect(getByText('Server Error')).toBeInTheDocument();

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

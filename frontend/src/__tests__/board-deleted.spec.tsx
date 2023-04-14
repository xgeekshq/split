import { fireEvent, waitFor } from '@testing-library/react';

import BoardDeleted from '@/pages/board-deleted';
import { ROUTES } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = () => renderWithProviders(<BoardDeleted />, { routerOptions: mockRouter });

describe('Pages/BoardDeleted', () => {
  it('should render correctly', () => {
    // Act
    const { getByText, getByRole } = render();
    const goDashboardButton = getByRole('button');

    // Assert
    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('Board deleted')).toBeInTheDocument();

    expect(goDashboardButton).toBeInTheDocument();
    expect(goDashboardButton).toHaveTextContent('Go to Dashboard');
  });

  it('should redirect user to dashboard', async () => {
    // Act
    const { getByRole } = render();

    const goDashboardButton = getByRole('button');
    fireEvent.click(goDashboardButton);

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(ROUTES.Dashboard, ROUTES.Dashboard, expect.anything());
    });
  });
});

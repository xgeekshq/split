import { fireEvent, waitFor } from '@testing-library/react';

import Breadcrumb, { BreadcrumbProps } from '@/components/Primitives/Breadcrumb/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const DUMMY_ITEMS = [
  { title: 'Teams', link: ROUTES.Teams },
  { title: 'Current Team', isActive: true },
];

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<BreadcrumbProps> = {}) =>
  renderWithProviders(<Breadcrumb items={DUMMY_ITEMS} {...props} />, { routerOptions: mockRouter });

describe('Components/Primitives/Breadcrumb', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    expect(getByTestId('breadcrumb').querySelectorAll('li')).toHaveLength(DUMMY_ITEMS.length);
  });

  it('should navigate to the link', async () => {
    // Act
    const { getByTestId, getByText } = render();

    // Assert
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    fireEvent.click(getByText('Teams'));

    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(ROUTES.Teams, ROUTES.Teams, expect.anything());
    });
  });
});

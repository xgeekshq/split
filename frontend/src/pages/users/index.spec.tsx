import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import Users from '@/pages/users';
import { libraryMocks } from '@/utils/testing/mocks';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const render = () => renderWithProviders(<Users />, { routerOptions: mockRouter });

describe('Pages/Users', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('usersList')).toBeInTheDocument();
  });
});

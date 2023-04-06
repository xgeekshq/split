import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import UserDetails from '@/pages/users/[userId]';
import { libraryMocks } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users/[userId]' });
libraryMocks.mockReactQuery({
  useQueryResult: {
    status: 'success',
    data: [...TeamFactory.createMany(3)],
  },
});

const render = () => renderWithProviders(<UserDetails />, { routerOptions: mockRouter });

describe('Pages/Users/[userId]', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('userHeader')).toBeInTheDocument();
    expect(getByTestId('teamsList')).toBeInTheDocument();
  });
});

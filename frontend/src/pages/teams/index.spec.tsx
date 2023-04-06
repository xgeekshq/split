import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import Teams from '@/pages/teams';
import { libraryMocks } from '@/utils/testing/mocks';
import { TeamFactory } from '@/utils/factories/team';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
libraryMocks.mockReactQuery({
  useQueryResult: {
    status: 'success',
    data: [...TeamFactory.createMany(3)],
  },
});

const render = () => renderWithProviders(<Teams />, { routerOptions: mockRouter });

describe('Pages/Teams', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('teamsList')).toBeInTheDocument();
  });
});

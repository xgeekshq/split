import useUsersWithTeams from '@/hooks/users/useUsersWithTeams';
import Users from '@/pages/users';
import { UseUsersWithTeamsQueryReturnType } from '@/types/hooks/users/useUsersWithTeamsQueryReturnType';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const mockUseUsersWithTeams = useUsersWithTeams as jest.Mock<
  Partial<UseUsersWithTeamsQueryReturnType>
>;
jest.mock('@/hooks/users/useUsersWithTeams');

const render = () => renderWithProviders(<Users />, { routerOptions: mockRouter });

describe('Pages/Users', () => {
  beforeEach(() => {
    mockUseUsersWithTeams.mockReturnValue({
      fetchUsersWithTeams: {
        status: 'loading',
      },
    } as unknown as Partial<UseUsersWithTeamsQueryReturnType>);
  });

  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('MainPageHeader')).toBeInTheDocument();
    expect(getByTestId('usersList')).toBeInTheDocument();
  });

  it.todo('should prefetch on getServerSide');
});

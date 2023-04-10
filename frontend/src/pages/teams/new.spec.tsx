import { renderWithProviders } from '@/utils/testing/renderWithProviders';

import NewTeam from '@/pages/teams/new';
import { libraryMocks } from '@/utils/testing/mocks';
import { UseQueryResult } from '@tanstack/react-query';
import useUsers from '@/hooks/users/useUsers';
import { User } from '@/types/user/user';
import { UserFactory } from '@/utils/factories/user';

const mockUseUsers = useUsers as jest.Mock<UseQueryResult<User[]>>;
jest.mock('@/hooks/users/useUsers');

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams/new' });

const render = () => renderWithProviders(<NewTeam />, { routerOptions: mockRouter });

describe('Pages/Teams/[teamId]', () => {
  it('should render correctly', () => {
    // Arrange
    mockUseUsers.mockReturnValue({
      data: UserFactory.createMany(10),
    } as UseQueryResult<User[]>);

    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('createTeam')).toBeInTheDocument();
  });
});

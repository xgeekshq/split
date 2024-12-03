import React from 'react';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import UserList from '@/components/Users/UsersList/UsersList';
import useUsersWithTeams from '@/hooks/users/useUsersWithTeams';
import { UseUsersWithTeamsQueryReturnType } from '@/types/hooks/users/useUsersWithTeamsQueryReturnType';
import { UserWithTeams } from '@/types/user/user';
import { UserFactory, UserWithTeamsFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const render = () =>
  renderWithProviders(<UserList />, {
    routerOptions: mockRouter,
  });

const mockUseUsersWithTeams = useUsersWithTeams as jest.Mock<
  Partial<UseUsersWithTeamsQueryReturnType>
>;
jest.mock('@/hooks/users/useUsersWithTeams');

describe('Components/Users/User/UsersList/UserList/UserList', () => {
  beforeEach(() => {
    mockUseUsersWithTeams.mockReturnValue({
      fetchUsersWithTeams: {
        status: 'loading',
      },
    } as unknown as Partial<UseUsersWithTeamsQueryReturnType>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    // Arrange
    const usersWithTeams: UserWithTeams[] = UserWithTeamsFactory.createMany(5);
    mockUseUsersWithTeams.mockReturnValueOnce({
      fetchUsersWithTeams: {
        status: 'success',
        data: {
          pages: [
            {
              hasNextPage: false,
              page: 0,
              userAmount: usersWithTeams.length,
              userWithTeams: usersWithTeams,
            },
          ],
          pageParams: [null],
        },
        isFetching: false,
        hasNextPage: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      },
    } as unknown as Partial<UseUsersWithTeamsQueryReturnType>);

    // Act
    const { getByTestId, findAllByTestId } = render();

    // Assert
    expect(getByTestId('usersSubHeader')).toBeInTheDocument();
    expect(await findAllByTestId('userItem')).toHaveLength(usersWithTeams.length);
  });

  it('should filter users correctly', async () => {
    // Arrange
    const users = UserFactory.createMany(3, [
      { firstName: 'Jack' },
      { firstName: 'John' },
      { firstName: 'Bryan' },
    ]);
    const usersWithTeams: UserWithTeams[] = UserWithTeamsFactory.createMany(3, [
      { user: users[0] },
      { user: users[1] },
      { user: users[2] },
    ]);
    const refetchMock = jest.fn();

    mockUseUsersWithTeams.mockReturnValue({
      fetchUsersWithTeams: {
        status: 'success',
        data: {
          pages: [
            {
              hasNextPage: false,
              page: 0,
              userAmount: usersWithTeams.length,
              userWithTeams: usersWithTeams,
            },
          ],
          pageParams: [null],
        },
        isFetching: false,
        hasNextPage: false,
        fetchNextPage: jest.fn(),
        refetch: refetchMock,
      },
    } as unknown as Partial<UseUsersWithTeamsQueryReturnType>);

    // Act
    const { getByLabelText } = render();

    const searchInput = getByLabelText('Search user');
    await userEvent.type(searchInput, 'Jack');

    // Assert
    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalled();
    });
  });
});

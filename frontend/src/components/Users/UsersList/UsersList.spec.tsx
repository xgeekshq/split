import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import UserList from '@/components/Users/UsersList/UsersList';
import { UserFactory, UserWithTeamsFactory } from '@/utils/factories/user';
import { UserWithTeams } from '@/types/user/user';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const render = () =>
  renderWithProviders(<UserList />, {
    routerOptions: mockRouter,
  });

describe('Components/Users/User/UsersList/UserList/UserList', () => {
  beforeEach(() => {
    libraryMocks.mockReactQuery({ useInfiniteQueryResult: { status: 'loading' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    // Arrange
    const usersWithTeams: UserWithTeams[] = UserWithTeamsFactory.createMany(5);
    libraryMocks.mockReactQuery({
      useInfiniteQueryResult: {
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
    });

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

    libraryMocks.mockReactQuery({
      useInfiniteQueryResult: {
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
    });

    // Act
    const { getByLabelText } = render();

    const searchInput = getByLabelText('Search user');
    userEvent.type(searchInput, 'Jack');

    // Assert
    await waitFor(() => {
      expect(refetchMock).toBeCalled();
    });
  });
});

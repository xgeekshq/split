import { getUsersWithTeams } from '@/api/userService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { UserWithTeamsFactory } from '@/utils/factories/user';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react';
import { InfiniteUsersWithTeams } from '@/types/user/user';
import useUsersWithTeams from '@/hooks/users/useUsersWithTeams';

const DUMMY_USERS = {
  hasNextPage: false,
  page: 0,
  userAmount: 5,
  userWithTeams: UserWithTeamsFactory.createMany(5),
};

const mockGetUsersWithTeams = getUsersWithTeams as jest.Mock<Promise<InfiniteUsersWithTeams>>;
jest.mock('@/api/userService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUsersWithTeams(), { wrapper: renderHookWithProviders(options) });

describe('hooks/users/useUsersWithTeams', () => {
  beforeEach(() => {
    mockGetUsersWithTeams.mockReturnValue(Promise.resolve(DUMMY_USERS));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the users', async () => {
    // Act
    const { result } = render();

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(result.current.data).toStrictEqual({
      pages: [DUMMY_USERS],
      pageParams: [undefined],
    });
  });

  it('should set toast error', async () => {
    // Arrange
    mockGetUsersWithTeams.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch users')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({ recoilOptions: { recoilState: toastState, recoilHandler } });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});

import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react';

import { getUsersWithTeams } from '@/api/userService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/users-messages';
import useUsersWithTeams from '@/hooks/users/useUsersWithTeams';
import { toastState } from '@/store/toast/atom/toast.atom';
import { InfiniteUsersWithTeams } from '@/types/user/user';
import { UserWithTeamsFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

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
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.GET));
    });
  });
});

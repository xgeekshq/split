import { act, renderHook, waitFor } from '@testing-library/react';

import { getUserTeams } from '@/api/teamService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import useUserTeams from '@/hooks/teams/useUserTeams';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { TeamFactory } from '@/utils/factories/team';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMS = TeamFactory.createMany(3);

const mockGetUserTeams = getUserTeams as jest.Mock<Promise<Team[]>>;

jest.mock('@/api/teamService');

const render = (userId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUserTeams(userId), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useUserTeams', () => {
  beforeEach(() => {
    mockGetUserTeams.mockReturnValue(Promise.resolve(DUMMY_TEAMS));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user teams', async () => {
    const { result } = render('thisIsTheUserId');

    await waitFor(() => expect(result.current.fetchUserTeams.isSuccess).toBeTruthy());
    expect(mockGetUserTeams).toHaveBeenCalled();
    expect(result.current.fetchUserTeams.data).toBe(DUMMY_TEAMS);
  });

  it('should set toast error', async () => {
    mockGetUserTeams.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch teams')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render('thisIsTheUserId', {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    act(() => result.current.handleErrorOnFetchUserTeams());

    // Assert
    await waitFor(() => {
      expect(result.current.fetchUserTeams.isError).toBeTruthy();
      expect(result.current.fetchUserTeams.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.GET));
    });
  });
});

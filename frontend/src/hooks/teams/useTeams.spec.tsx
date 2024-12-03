import { act, renderHook, waitFor } from '@testing-library/react';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import useTeams from '@/hooks/teams/useTeams';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { TeamFactory } from '@/utils/factories/team';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMS = TeamFactory.createMany(3);

const mockGetAllTeams = getAllTeams as jest.Mock<Promise<Team[]>>;
const mockGetUserTeams = getUserTeams as jest.Mock<Promise<Team[]>>;

jest.mock('@/api/teamService');

const render = (isSAdmin: boolean, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useTeams(isSAdmin), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useTeams', () => {
  beforeEach(() => {
    mockGetAllTeams.mockReturnValue(Promise.resolve(DUMMY_TEAMS));
    mockGetUserTeams.mockReturnValue(Promise.resolve(DUMMY_TEAMS));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all the teams as Super Admin', async () => {
    const { result } = render(true);

    await waitFor(() => expect(result.current.fetchAllTeams.isSuccess).toBeTruthy());
    expect(mockGetAllTeams).toHaveBeenCalled();
    expect(mockGetUserTeams).not.toHaveBeenCalled();
    expect(result.current.fetchAllTeams.data).toBe(DUMMY_TEAMS);
  });

  it('should fetch user the teams', async () => {
    const { result } = render(false);

    await waitFor(() => expect(result.current.fetchAllTeams.isSuccess).toBeTruthy());
    expect(mockGetUserTeams).toHaveBeenCalled();
    expect(mockGetAllTeams).not.toHaveBeenCalled();
    expect(result.current.fetchAllTeams.data).toBe(DUMMY_TEAMS);
  });

  it('should set toast error', async () => {
    mockGetAllTeams.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch teams')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(true, { recoilOptions: { recoilState: toastState, recoilHandler } });

    act(() => result.current.handleErrorOnFetchAllTeams());

    // Assert
    await waitFor(() => {
      expect(result.current.fetchAllTeams.isError).toBeTruthy();
      expect(result.current.fetchAllTeams.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.GET));
    });
  });
});
